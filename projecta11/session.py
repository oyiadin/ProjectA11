# coding=utf-8

import base64
import redis
import os
from projecta11.config import conf


class Session(object):
    def __init__(self, sess_str=None, *args, **kwargs):
        self.r = redis.Redis(*args, **kwargs, **conf.session.connection)
        self.key = None

        if sess_str:
            if self.r.exists(sess_str):
                self.key = sess_str
            else:
                raise FileNotFoundError('no specific session_id')
        else:
            self.key = self._generate_new_session_id()

    def _generate_new_session_id(self):
        key = base64.b64encode(os.urandom(48))
        while self.r.exists(key):
            key = base64.b64encode(os.urandom(48))

        self.r.hset(key, "is_login", 0)
        self.r.expire(key, conf.session.expires_after)

        return key

    def __getitem__(self, item):
        if not isinstance(item, tuple):
            return self.r.hget(self.key, item)
        return self.r.hmget(self.key, *item)

    def __setitem__(self, key, value):
        return self.r.hset(self.key, key, value)

    def expire(self, time):
        return self.r.expire(self.key, time)
