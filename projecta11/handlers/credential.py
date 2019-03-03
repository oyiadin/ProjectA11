# coding=utf-8

from functools import reduce

from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling, url
from projecta11.utils.config import conf
from projecta11.utils.session import Session
import projecta11.utils.db as db


@handling(r"/credential/account")
class AccountHandler(BaseHandler):
    def post(self):
        data = self.parse_json_body()
        if data is None:
            return

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

    def delete(self):
        session_id = self.get_argument('session_id')
        if session_id is None:
            return self.finish(403, 'all arguments are required')

        try:
            sess = Session(session_id)
        except FileNotFoundError as e:
            return self.finish(404, str(e))

        sess.r.delete(session_id)
        del sess
        self.finish()

    def put(self):
        data = self.parse_json_body()
        if data is None:
            return

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
