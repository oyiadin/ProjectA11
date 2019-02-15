# coding=utf-8

from projecta11.handlers.base import BaseHandler
from projecta11.handlers.decorators import role_assert
from projecta11.routers import handling


@handling('class_show', r"/classes/show/([0-9]+)")
class ClassShowHandler(BaseHandler):
    def get(self, class_id):
        pass


@handling('class_create', r"/classes/create")
class ClassCreateHandler(BaseHandler):
    @role_assert("teacher")
    def get(self):
        self.render("classes/create.html")

    @role_assert("teacher")
    def post(self):
        raise NotImplementedError
