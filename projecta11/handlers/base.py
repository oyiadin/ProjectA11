# coding=utf-8

import hashlib

import tornado.web
import projecta11.utils.db as db
from projecta11.utils.config import conf


class BaseHandler(tornado.web.RequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._session_db = None

    def _get_session_db(self):
        if self._session_db:
            return self._session_db
        self._session_db = db.Session()
        return self._session_db

    def _set_session_db(self, value):
        if self._session_db:
            self._session_db.close()
        self._session_db = value

    def _del_session_db(self):
        if self._session_db:
            self._session_db.close()
        self._session_db = None

    session_db = property(_get_session_db, _set_session_db, _del_session_db)

    def get_current_user(self):
        username = self.get_secure_cookie('username')
        if username is None:
            return None
        return self.session_db.query(db.User).filter(
            db.User.username == username).first()

    def render(self, *args, **kwargs):
        kwargs.update(dict(page=conf.page, conf=conf))
        return super().render(*args, **kwargs)

    def hash_password(self, password):
        hashed = hashlib.sha256(password.encode()).hexdigest()
        salted = hashed + conf.app.password_salt
        hashed_and_salted = hashlib.sha256(salted.encode()).hexdigest()
        return hashed_and_salted
