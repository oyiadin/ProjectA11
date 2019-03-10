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

    @require_session
    def delete(self, class_id, sess=None):
        self.db.query(db.Class).filter(
            db.Class.class_id == class_id).delete()
        self.db.commit()

        self.finish()


@handling(r"/user/(\d+)/classes")
class SpecificUserClassesInformationHandler(BaseHandler):
    @require_session
    def get(self, user_id, sess=None):
        selected = self.db.query(db.Class).filter(
            db.Class.teacher_id == user_id).all()
        if not selected:
            self.finish(404, 'not found')
            return

        list = []
        for i in selected:
            dict = {
                'class_id': i.class_id,
                'class_name': self.db.query(db.Class.class_name).filter(
                    db.Class.class_name == i.class_name).first()[0],
                'weeekday': self.db.query(db.Class.weekday).filter(
                    db.Class.weekday == i.weekday).first()[0],
                'start': self.db.query(db.Class.start).filter(
                    db.Class.start == i.start).first()[0],
                'end': self.db.query(db.Class.end).filter(
                    db.Class.end == i.end).first()[0],
                'teacher_id': self.db.query(db.Class.teacher_id).filter(
                    db.Class.teacher_id == i.teacher_id).first()[0],
                'course_id': self.db.query(db.Class.course_id).filter(
                    db.Class.course_id == i.course_id).first()[0]
            }
            list.append(dict)
        self.finish(list=list)



