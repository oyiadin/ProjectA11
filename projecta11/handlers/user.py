# coding=utf-8

from projecta11.handlers.base import BaseHandler
from projecta11.utils.decorators import login_needed
from projecta11.routers import handling


@handling(r"/user")
class UserInformationHandler(BaseHandler):
    def get(self):
        pass
