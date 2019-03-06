# coding=utf-8

from functools import reduce

from projecta11.handlers.base import BaseHandler
from projecta11.utils import (
    parse_json_body, require_session, keys_filter, hash_password
)
from projecta11.routers import handling
from projecta11.config import conf
from projecta11.session import Session
import projecta11.db as db


@handling(r"/credential/account")
class AccountHandler(BaseHandler):
    @parse_json_body
    def put(self, data=None):
        keys = ('staff_id', 'password')
        data = keys_filter(data, keys)

        if not reduce(lambda a, b: a and (b is not None), data):
            return self.finish(403, 'all arguments are required')

        selected = self.db.query(db.User).filter(
            db.User.staff_id == data['staff_id']).first()
        if selected is not None:
            return self.finish(409, 'conflict user information')

        data['password'] = hash_password(
            data['password'] + conf.app.password_salt)

        new_user = db.User(**data)
        self.db.add(new_user)
        self.db.commit()

        self.finish()

    @parse_json_body
    def post(self, data=None):
        staff_id = data.get('staff_id')
        password = data.get('password')

        if not (staff_id and password):
            return self.finish(403, 'all arguments are required')

        password = hash_password(password + conf.app.password_salt)

        selected = self.db.query(db.User).filter(
            db.User.staff_id == staff_id, db.User.password == password).first()
        if selected is None:
            return self.finish(404, 'wrong user_id or password')

        user_id = selected.user_id
        sess = Session()
        sess['user_id'] = user_id
        sess['staff_id'] = staff_id
        sess.expire(conf.session.expires_after)

        self.finish(session_id=sess.key, user_id=user_id)

    @require_session
    def delete(self, sess=None):
        sess.r.delete(sess.key)
        del sess
        self.finish()


@handling(r"/credential/session_id")
class SessionIDRenewHandler(BaseHandler):
    @require_session
    def post(self, sess=None):
        sess.expire(conf.session.expires_after)
