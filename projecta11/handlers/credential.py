# coding=utf-8
import time
from functools import reduce

from projecta11.handlers.base import BaseHandler
from projecta11.utils import (
    parse_json_body, require_session, keys_filter, hash_password
)
from projecta11.routers import handling
from projecta11.config import conf
from projecta11.session import Session
import projecta11.db as db


@handling(r"/credential/session_id")
class SessionIDHandler(BaseHandler):
    def get(self):
        sess = Session()
        self.finish(session_id=sess.id)

    def options(self):
        session_id = self.get_argument('session_id', None)
        if session_id is None:
            return self.finish(403, 'missing arguments')

        try:
            sess = Session(session_id)
        except FileNotFoundError as e:
            return self.finish(is_valid=False)

        self.finish(is_valid=True)

    @require_session
    def post(self, sess=None):
        if not conf.app.debug:
            return self.finish(405, 'not currently in debug mode')

        expire_at = int(time.time() + conf.session.expires_after)
        sess.r.set(sess.id, expire_at)
        sess.r.expireat(sess.id, expire_at)

        keys = sess.r.keys("{}:*".format(sess.id))
        for key in map(lambda x: x.decode(), keys):
            if key.split(':')[1] != 'captcha':
                sess.r.expireat(key, expire_at)


@handling(r"/credential/account")
class AccountHandler(BaseHandler):
    @parse_json_body
    @require_session
    def put(self, data=None, sess=None):
        captcha_key = 'captcha:0cc175b9c0f1b6a8'

        keys = {'staff_id', 'password', 'role', 'name', 'is_male', 'captcha'}
        data = keys_filter(data, keys)

        if not reduce(lambda a, b: a and b, map(
                lambda x: x[0] and (x[1] is not None), data.items())):
            return self.finish(403, 'missing arguments')

        captcha = data['captcha'].lower()
        correct_captcha = (sess.get(captcha_key) or b'').decode()
        sess.delete(captcha_key)
        if captcha != correct_captcha:
            if conf.app.debug:
                return self.finish(
                    405, 'incorrect captcha', correct_captcha=correct_captcha)
            return self.finish(405, 'incorrect captcha')

        if not isinstance(data['role'], int):
            return self.finish(400, 'role must be a digit')
        data['role'] = db.int2UserRole[data['role']]

        if isinstance(data['is_male'], str) and not data['is_male'].isdigit():
            return self.finish(400, 'is_male must be a digit')
        data['is_male'] = bool(int(data['is_male']))

        selected = self.db.query(db.User).filter(
            db.User.staff_id == data['staff_id']).first()
        if selected is not None:
            return self.finish(409, 'conflict user information')

        data['password'] = hash_password(data['password'])

        keys = keys - {'captcha'}
        data = keys_filter(data, keys)
        new_user = db.User(**data)
        self.db.add(new_user)
        self.db.commit()

    @require_session
    @parse_json_body
    def post(self, data=None, sess=None):
        captcha_key = 'captcha:9c15af0d3e0ea84d'
        staff_id = data.get('staff_id')
        password = data.get('password')
        role = data.get('role')
        captcha = data.get('captcha')

        if not (staff_id and password and captcha and role is not None):
            return self.finish(403, 'missing arguments')

        captcha = captcha.lower()
        correct_captcha = (sess.get(captcha_key) or b'').decode()
        sess.delete(captcha_key)
        if captcha != correct_captcha:
            if conf.app.debug:
                return self.finish(
                    405, 'incorrect captcha', correct_captcha=correct_captcha)
            return self.finish(405, 'incorrect captcha')

        if not isinstance(role, int):
            return self.finish(400, 'role must be a digit')
        role = db.int2UserRole[role]

        password = hash_password(password)

        selected = self.db.query(db.User).filter(
            db.User.staff_id == staff_id,
            db.User.password == password,
            db.User.role == role).first()
        if selected is None:
            return self.finish(404, 'no matched data')

        sess['is_login'] = 1
        sess['user_id'] = selected.user_id
        sess['staff_id'] = staff_id

        self.finish(user_id=selected.user_id, name=selected.name)

    @require_session
    def delete(self, sess=None):
        sess.delete()
