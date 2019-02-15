# coding=utf-8

from projecta11.handlers.base import BaseHandler, register_error_handler
from projecta11.routers import handling


@handling('404', '/404')
@register_error_handler(404)
class Error404Handler(BaseHandler):
    def get(self):
        self.render('404.html')
