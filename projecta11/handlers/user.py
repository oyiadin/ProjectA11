# coding=utf-8

from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling
from projecta11.utils import require_session, keys_filter


@handling(r"/user")
class UserInformationHandler(BaseHandler):
    @require_session
    def get(self, sess=None):
        keys = ('staff_id',)
        ret = keys_filter(sess, keys)
        self.finish(**ret)
