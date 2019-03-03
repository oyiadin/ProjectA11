# coding=utf-8

from json.decoder import JSONDecodeError

import projecta11.db as db
from projecta11.session import Session
from tornado.escape import json_decode


def role_assert(*roles):
    def decorator(func):
        def wrapper(self, *args, **kwargs):
            if self.current_user is None:
                self.redirect('/login')
            else:
                for role in roles:
                    if db.string2role[role] == self.current_user.role:
                        return func(self, *args, **kwargs)
                    self.redirect('/login')
        return wrapper
    return decorator


def parse_json_body(func):
    def wrapper(self, *args, **kwargs):
        try:
            data = json_decode(self.request.body)
        except JSONDecodeError:
            self.finish(400, 'bad request')
            return
        return func(self, *args, data=data, **kwargs)
    return wrapper


def require_session(func):
    def wrapper(self, *args, **kwargs):
        session_id = self.get_argument('session_id', None)
        if session_id is None:
            self.finish(403, 'all arguments are required')
            return

        try:
            sess = Session(session_id)
        except FileNotFoundError as e:
            self.finish(404, str(e))
            return
        return func(self, *args, sess=sess, **kwargs)
    return wrapper