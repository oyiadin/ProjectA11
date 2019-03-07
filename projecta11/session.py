# coding=utf-8
import time

import redis
import os
from projecta11.config import conf


class Session(object):
    def __init__(self, session_id=None, *args, **kwargs):
        self.r = redis.Redis(*args, **kwargs, **conf.session.connection)
        self.id = self.expire_at = None

        if session_id:
            if self.r.exists(session_id):
                self.id = session_id
                self.expire_at = int(self.r.get(self.id))
            else:
                raise FileNotFoundError('illegal session_id')
        else:
            _id = os.urandom(48).hex()
            while self.r.exists(_id):
                _id = os.urandom(48).hex()
            self.id = _id

            self.expire_at = int(time.time() + conf.session.expires_after)
            self.r.set(_id, self.expire_at)
            self.r.expireat(_id, self.expire_at)
            self.set("is_login", 0)

    def get(self, *keys):
        if len(keys) == 1:
            return self.r.get('{}:{}'.format(self.id, keys[0]))
        else:
            real_keys = map(lambda x: '{}:{}'.format(self.id, x), keys)
            return self.r.mget(real_keys)

    def __getitem__(self, item):
        return self.r.get('{}:{}'.format(self.id, item))

    def set(self, key, value, expire_at=None):
        key = '{}:{}'.format(self.id, key)

        self.r.set(key, value)
        if expire_at:
            self.r.expireat(key, expire_at)
        else:
            self.r.expireat(key, self.expire_at)

    def __setitem__(self, key, value):
        key = '{}:{}'.format(self.id, key)

        self.r.set(key, value)
        self.r.expireat(key, self.expire_at)

    def delete(self, key=None):
        if key is not None:
            key = '{}:{}'.format(self.id, key)
            return self.r.delete(key)
        else:
            # remove this whole session
            keys = self.r.keys('{}:*'.format(self.id))
            for key in keys:
                self.r.delete(key)

    def incr(self, key):
        key = '{}:{}'.format(self.id, key)
        return self.r.incr(key)

    def expireat(self, key, at):
        key = '{}:{}'.format(self.id, key)
        return self.r.expireat(key, at)
