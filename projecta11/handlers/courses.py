# coding=utf-8
from functools import reduce

from projecta11 import db
from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling
from projecta11.utils import require_session, parse_json_body, keys_filter, \
    role_in


@handling(r"/course")
class NewCourseHandler(BaseHandler):
    @require_session
    @role_in(db.UserRole.teacher, db.UserRole.admin)
    @parse_json_body
    def put(self, data=None, sess=None):
        keys = ('course_name', 'start', 'end')
        data = keys_filter(data, keys)

        if not reduce(lambda a, b: a and b, map(
                lambda x: x[0] and (x[1] is not None), data.items())):
            return self.finish(403, 'missing arguments')

        new_course = db.Course(**data)
        self.db.add(new_course)
        self.db.commit()

        self.finish(course_id=new_course.course_id)

    @parse_json_body
    def post(self, data=None):
        keys = ('pattern',)
        data = keys_filter(data, keys)

        if not data['pattern']:
            return self.finish(403, 'missing arguments')
        pattern = '%{}%'.format(data['pattern'])

        selected = self.db.query(db.Course).filter(
            db.Course.course_name.like(pattern)).all()

        list = []
        for course in selected:
            list.append(dict(
                course_id=course.course_id,
                course_name=course.course_name,
                start=course.start,
                end=course.end))

        self.finish(total=len(list), list=list)


@handling(r"/course/(\d+)")
class SpecificCourseHandler(BaseHandler):
    def get(self, course_id):
        selected = self.db.query(db.Course).filter(
            db.Course.course_id == int(course_id)).first()
        if selected is None:
            self.finish(404, 'no matched data')
            return

        ret = dict(
            course_id=selected.course_id,
            course_name=selected.course_name,
            start=selected.start,
            end=selected.end)

        self.finish(**ret)

    @require_session
    def delete(self, course_id, sess=None):
        # TODO: permission check

        selected = self.db.query(db.Course).filter(
            db.Course.course_id == course_id).first()
        if selected is None:
            return self.finish(404, 'no matched data')

        self.db.delete(selected)
        self.db.commit()

        self.finish()


@handling(r"/user/(\d+)/courses")
class UserEnrolledInCoursesHandler(BaseHandler):
    @require_session
    def get(self, user_id, sess=None):
        selected = self.db.query(db.RelationUserClass).filter(
            db.RelationUserClass.user_id == user_id).all()
        if not len(selected):
            return self.finish(list=[])

        list = []
        for rel in selected:
            _course_id = self.db.query(db.Class.course_id).filter(
                db.Class.class_id == rel.class_id).first()[0]
            _course = self.db.query(db.Course).filter(
                db.Course.course_id == _course_id).first()
            list.append(dict(
                course_id=_course.course_id,
                course_name=_course.course_name,
                start=_course.start,
                end=_course.end))
        self.finish(list=list)
