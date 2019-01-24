# coding=utf-8
from projecta11.handlers.base import BaseHandler

class IndexHandler(BaseHandler):
    def get(self):
        self.render("index.html")
