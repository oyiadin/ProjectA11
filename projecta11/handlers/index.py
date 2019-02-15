# coding=utf-8

from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling


@handling('index', r"/")
class IndexHandler(BaseHandler):
    def get(self):
        self.render("index.html")
