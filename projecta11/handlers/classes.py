# coding=utf-8

from projecta11.handlers.base import BaseHandler
from projecta11.handlers.decorators import role_assert
from projecta11.routers import handling


@handling(r"/classes/(\d+)")
class ClassShowHandler(BaseHandler):
    def get(self):
        class_id = self.get_argument('class_id')
        pass


@handling(r"/classes")
class ClassCreateHandler(BaseHandler):
    @role_assert("teacher")
    def put(self):
        raise NotImplementedError
