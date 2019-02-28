# coding=utf-8

import hashlib

import tornado.web
import projecta11.utils.db as db
import projecta11.utils.session as session
from projecta11.utils.config import conf
from projecta11.routers import handling, url


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

    def get_current_user(self):
        if not self.sess['is_login']:
            return None
        return self.db_sess.query(db.User).filter(
            db.User.username == self.sess['username']).first()

    def render(self, *args, **kwargs):
        kwargs.update(dict(page=conf.page, conf=conf, url=url, sess=self.sess))
        return super().render(*args, **kwargs)

    def hash_password(self, password):
        hashed = hashlib.sha256(password.encode()).hexdigest()
        salted = hashed + conf.app.password_salt
        hashed_and_salted = hashlib.sha256(salted.encode()).hexdigest()
        return hashed_and_salted

def register_error_handler(status_code):
    def decorator(func):
        return func # TODO
    return decorator
