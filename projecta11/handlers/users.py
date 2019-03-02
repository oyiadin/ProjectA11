# coding=utf-8

from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling


@handling(r"/users/(\d+)")
class SpecificUserInformationHandler(BaseHandler):
    def get(self):
        pass
