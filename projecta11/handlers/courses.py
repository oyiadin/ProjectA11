# coding=utf-8

from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling
from projecta11.utils import require_session


@handling(r"/courses/(\d+)")
class CourseInformationHandler(BaseHandler):
    @require_session
    def get(self, class_id, sess=None):
        pass
