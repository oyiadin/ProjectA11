# coding=utf-8
from projecta11 import db
from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling
from projecta11.utils import require_session, parse_json_body, keys_filter


@handling(r"/course")
class NewCourseHandler(BaseHandler):
    @require_session
    @parse_json_body
    def put(self, data=None, sess=None):
        keys = ('course_name', 'start', 'end')
        data = keys_filter(data, keys)

        new_course = db.Course(**data)
        self.db.add(new_course)
        self.db.commit()

        self.finish(course_id=new_course.course_id)


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
