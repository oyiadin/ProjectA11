# coding=utf-8
import time

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
        key = os.urandom(48).hex()
        while self.r.exists(key):
            key = os.urandom(48).hex()

        self.r.hset(key, "is_login", 0)
        self.r.expire(key, conf.session.expires_after)

        return key

    def get_captcha(self, app_id):
        key = 'captcha:{}:{}'.format(app_id, self.key)
        return self.r.get(key)

    def set_captcha(self, app_id, code, expire=None):
        expire = int(time.time() + conf.session.captcha_expires_after) \
            if expire is None else expire
        key = 'captcha:{}:{}'.format(app_id, self.key)

        self.r.set(key, code)
        self.r.expire(key, expire)

    def __getitem__(self, item):
        if not isinstance(item, tuple):
            return self.r.hget(self.key, item)
        return self.r.hmget(self.key, *item)

    def __setitem__(self, key, value):
        return self.r.hset(self.key, key, value)

    def expire(self, time):
        return self.r.expire(self.key, time)
