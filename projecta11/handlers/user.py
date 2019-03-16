# coding=utf-8
from projecta11 import db
from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling
from projecta11.utils import require_session, keys_filter


@handling(r"/user")
class UserInformationHandler(BaseHandler):
    @require_session
    def get(self, sess=None):
        keys = ('user_id', 'staff_id', 'role', 'name', 'is_male')
        selected = self.db.query(db.User).filter(
            db.User.user_id == sess['user_id']).first()
        ret = dict(
            user_id=selected.user_id,
            staff_id=selected.staff_id,
            role=selected.role.value,
            name=selected.name,
            is_male=selected.is_male)
        self.finish(**ret)


@handling(r"/user/(\d+)")
class SpecificUserInformationHandler(BaseHandler):
    def get(self, user_id):
        selected = self.db.query(db.User).filter(
            db.User.user_id == user_id).first()
        if selected is None:
            self.finish(404, 'no matched data')
            return

        ret = dict(
            user_id=selected.user_id,
            staff_id=selected.staff_id,
            role=selected.role.value,
            name=selected.name,
            is_male=selected.is_male)
        self.finish(**ret)

    @require_session
    def delete(self, user_id, sess=None):
        selected = self.db.query(db.User).filter(
            db.User.user_id == user_id).first()
        if selected is None:
            return self.finish(404, 'no matched data')

        self.db.delete(selected)
        self.db.commit()

        self.finish()
