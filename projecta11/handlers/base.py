# coding=utf-8

import hashlib
from tornado.escape import json_encode
import tornado.web
import projecta11.db as db
import projecta11.session as session
from projecta11.config import conf


class BaseHandler(tornado.web.RequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._session = None
        self._session_db = None

    def _get_session(self):
        if self._session:
            return self._session
        self._session = session.Session(self)
        return self._session

    def _set_session(self, value):
        raise PermissionError("no manual session replacement")

    def _del_session(self):
        if self._session:
            del self._session
        self._session = None

    sess = property(_get_session, _set_session, _del_session)

    def _get_session_db(self):
        if self._session_db:
            return self._session_db
        self._session_db = db.Session()
        return self._session_db

    def _set_session_db(self, value):
        raise PermissionError("no manual db-session replacement")

    def _del_session_db(self):
        if self._session_db:
            self._session_db.close()
        self._session_db = None

    db_sess = property(_get_session_db, _set_session_db, _del_session_db)

    def finish(self, code=200, msg='OK', **kwargs):
        kwargs.update(msg=msg, code=code)
        return super().finish(json_encode(kwargs))

    def get_current_user(self):
        if not int(self.sess['is_login']):
            return None
        return self.db_sess.query(db.User).filter(
            db.User.username == self.sess['username']).first()

    def hash_password(self, password):
        hashed = hashlib.sha256(password.encode()).hexdigest()
        salted = hashed + conf.app.password_salt
        hashed_and_salted = hashlib.sha256(salted.encode()).hexdigest()
        return hashed_and_salted


def register_error_handler(status_code):
    def decorator(func):
        return func # TODO
    return decorator
