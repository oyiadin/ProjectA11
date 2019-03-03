# coding=utf-8

from projecta11 import db
from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling


@handling(r"/users/(\d+)")
class SpecificUserInformationHandler(BaseHandler):
    def get(self, staff_id):
        selected_user = self.db_sess.query(db.User).filter(
            db.User.staff_id == staff_id).first()
        if selected_user is None:
            self.finish(404, 'wrong staff_id')
            return

        ret = dict(
            staff_id=selected_user.staff_id,
        )
        self.finish(**ret)
