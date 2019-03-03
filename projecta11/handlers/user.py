# coding=utf-8

from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling
from projecta11.utils import require_session


@handling(r"/user")
class UserInformationHandler(BaseHandler):
    @require_session
    def get(self, sess=None):
        keys = ('staff_id',)
        ret = dict(zip(keys, map(
            lambda x: x.decode() if isinstance(x, bytes) else x,
            sess[keys])))
        self.finish(**ret)
