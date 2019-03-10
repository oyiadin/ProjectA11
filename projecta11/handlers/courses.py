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
class CourseInformationHandler(BaseHandler):
    def get(self, course_id):
        selected = self.db.query(db.Course).filter(
            db.Course.course_id == int(course_id)).first()
        if selected is None:
            self.finish(404, 'not found')
            return

        ret = dict(
            course_id=selected.course_id,
            course_name=selected.course_name,
            start=selected.start,
            end=selected.end,
        )

        self.finish(**ret)

    def delete(self, course_id, sess=None):
        self.db.query(db.Course).filter(
            db.Course.course_id == course_id).delete()
        self.db.commit()

        self.finish()

'''
@handling(r"/user/(\d+)/courses")
class SpecificUserCoursesInformationHandler(BaseHandler):
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
                'course_id': i.course_id,
                'course_name': self.db.query(db.Course.course_name).filter(
                    db.Course.course_name == i.course_name).first()[0],
                'start': self.db.query(db.Course.start).filter(
                    db.Course.start == i.start).first()[0],
                'end': self.db.query(db.Course.end).filter(
                    db.Course.end == i.end).first()[0]
            }
            list.append(dict)
        self.finish(list=list)
'''