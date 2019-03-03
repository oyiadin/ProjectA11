# coding=utf-8

from functools import reduce

from projecta11.handlers.base import BaseHandler
from projecta11.utils import parse_json_body, require_session
from projecta11.routers import handling
from projecta11.config import conf
from projecta11.session import Session
import projecta11.db as db


@handling(r"/credential/account")
class AccountHandler(BaseHandler):
    @parse_json_body
    def post(self, data=None):
        staff_id = data.get('staff_id')
        password = data.get('password')

        if not (staff_id and password):
            return self.finish(403, 'all arguments are required')

        password = self.hash_password(password)

        selected_user = self.db_sess.query(db.User).filter(
            db.User.staff_id == staff_id, db.User.password == password).first()
        if selected_user is None:
            return self.finish(404, 'wrong staff_id or password')

        sess = Session()
        sess['is_login'] = 1
        sess['staff_id'] = staff_id
        sess.expire(conf.session.expires_after)
        # TODO: 加上其他检测，防止 session 被盗用，以及保证仅单 session 有效

        self.finish(session_id=sess.key)

    @require_session
    def delete(self, sess=None):
        sess.r.delete(sess.key)
        del sess
        self.finish()

    @parse_json_body
    def put(self, data=None):
        keys = ['staff_id', 'password', 'name', 'is_male']
        data = dict(filter(lambda x: x[0] in keys, data))

        if not reduce(lambda a, b: a and (b is not None), data):
            return self.finish(403, 'all arguments are required')

        selected_user = self.db_sess.query(db.User).filter(
            db.User.staff_id == data['staff_id']).first()
        if selected_user is None:
            return self.finish(409, 'conflict user information')

        data['password'] = self.hash_password(data['password'])
        data['is_male'] = bool(data['is_male'])

        new_user = db.User(**data)
        self.db_sess.add(new_user)
        self.db_sess.commit()
        self.db_sess.close()

        self.finish()
