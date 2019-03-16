# coding=utf-8
from projecta11 import db
from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling
from projecta11.utils import require_session, parse_json_body, keys_filter, \
    role_in


@handling(r"/course/(\d+)/classes")
class ClassesListHandler(BaseHandler):
    def get(self, course_id):
        selected = self.db.query(db.Class, db.User.name).join(db.User).filter(
            db.Class.course_id == course_id).all()

        list = []
        for i, teacher_name in selected:
            list.append(dict(
                class_id=i.class_id,
                class_name=i.class_name,
                weekday=i.weekday,
                start=i.start,
                end=i.end,
                teacher_id=i.teacher_id,
                teacher_name=teacher_name,
                course_id=i.course_id))

        self.finish(total=len(list), list=list)


@handling(r"/class")
class NewClassHandler(BaseHandler):
    @require_session
    @parse_json_body
    @role_in(db.UserRole.teacher)
    def put(self, data=None, sess=None):
        keys = ('class_name', 'weekday', 'start', 'end', 'teacher_id',
                'course_id')
        data = keys_filter(data, keys)

        new_class = db.Class(**data)
        self.db.add(new_class)
        self.db.commit()

        self.finish(class_id=new_class.class_id)


@handling(r"/class/(\d+)")
class ClassInfoHandler(BaseHandler):
    def get(self, class_id):
        selected = self.db.query(db.Class).filter(
            db.Class.class_id == class_id).first()
        if selected is None:
            return self.finish(404, 'not found')

        ret = dict(
            class_id=selected.class_id,
            class_name=selected.class_name,
            weekday=selected.weekday,
            start=selected.start,
            end=selected.end,
            teacher_id=selected.teacher_id,
            course_id=selected.course_id)

        self.finish(**ret)

    @require_session
    def delete(self, class_id, sess=None):
        selected = self.db.query(db.Class).filter(
            db.Class.class_id == class_id).first()
        if selected is None:
            return self.finish(404, 'no matched data')

        self.db.delete(selected)
        self.db.commit()


@handling(r"/class/(\d+)/enroll_in")
class ClassEnrollInHandler(BaseHandler):
    @require_session
    def post(self, class_id, sess=None):
        selected = self.db.query(db.RelationUserClass).filter(
            db.RelationUserClass.class_id == class_id,
            db.RelationUserClass.user_id == sess['user_id']).first()
        if selected is not None:
            return self.finish(405, "you've already enrolled in before")

        new_item = db.RelationUserClass(
            user_id=sess['user_id'],
            class_id=class_id)
        self.db.add(new_item)
        self.db.commit()


@handling(r"/user/(\d+)/classes")
class UserEnrolledInClassesHandler(BaseHandler):
    @require_session
    def get(self, user_id, sess=None):
        selected = self.db.query(db.RelationUserClass).filter(
            db.RelationUserClass.user_id == user_id).all()

        list = []
        for rel in selected:
            _class = self.db.query(db.Class).filter(
                db.Class.class_id == rel.class_id).first()
            teacher_name = self.db.query(db.User.name).filter(
                db.User.user_id == _class.teacher_id).first()
            list.append(dict(
                class_id=_class.class_id,
                class_name=_class.class_name,
                weekday=_class.weekday,
                start=_class.start,
                end=_class.end,
                teacher_id=_class.teacher_id,
                teacher_name=teacher_name,
                course_id=_class.course_id))

        self.finish(list=list)
