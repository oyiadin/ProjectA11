# coding=utf-8

import base64
import redis
import time
import os
from projecta11.utils.config import conf


class Session(object):
    def __init__(self, handler, *args, **kwargs):
        self.r = redis.Redis(*args, **kwargs, **conf.session.connection)
        self.key = None

        sess_str = handler.get_cookie('session')
        if sess_str:
            if not self.r.exists(sess_str):
                self.key = self._generate_new_session_id()
                handler.set_cookie(
                    'session', self.key,
                    expires=time.time() + conf.session.expires_after)
            else:
                self.key = sess_str
        else:
            self.key = self._generate_new_session_id()
            handler.set_cookie('session', self.key)

    def _generate_new_session_id(self):
        key = base64.b64encode(os.urandom(48))
        while self.r.exists(key):
            key = base64.b64encode(os.urandom(48))

        self.r.hset(key, "is_login", 0)
        self.r.expire(key, conf.session.expires_after)

        return key

    def __getitem__(self, item):
        return self.r.hget(self.key, item)

    def __setitem__(self, key, value):
        return self.r.hset(self.key, key, value)

    def expire(self, time):
        return self.r.expire(self.key, time)
