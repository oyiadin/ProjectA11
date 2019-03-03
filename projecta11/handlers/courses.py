# coding=utf-8

from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling


@handling(r"/courses/(\d+)")
class CourseInformationHandler(BaseHandler):
    def get(self, class_id):
        raise NotImplementedError
