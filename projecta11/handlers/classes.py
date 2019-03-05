# coding=utf-8
from projecta11 import db
from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling
from projecta11.utils import require_session, parse_json_body, keys_filter


@handling(r"/class")
class NewClassHandler(BaseHandler):
    @require_session
    @parse_json_body
    def put(self, data=None, sess=None):
        keys = (
            'class_name', 'weekday', 'start', 'end', 'teacher_id', 'course_id'
        )
        data = keys_filter(data, keys)

        new_class = db.Class(**data)
        self.db.add(new_class)
        self.db.commit()

        self.finish(class_id=new_class.class_id)


@handling(r"/class/(\d+)")
class ClassInformationHandler(BaseHandler):
    def get(self, class_id):
        selected = self.db.query(db.Class).filter(
            db.Class.class_id == int(class_id)).first()
        if selected is None:
            self.finish(404, 'not found')
            return

        ret = dict(
            class_id=selected.class_id,
            class_name=selected.class_name,
            weekday=selected.weekday,
            start=selected.start,
            end=selected.end,
            teacher_id=selected.teacher_id,
            course_id=selected.course_id,
        )

        self.finish(**ret)
