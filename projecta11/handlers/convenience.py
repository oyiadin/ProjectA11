# coding=utf-8

from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling


@handling('convenience', '/_/(.+)')
class FrontendAnyPageHandler(BaseHandler):
    def get(self, template_name):
        self.render(template_name)
