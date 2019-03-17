# coding=utf-8

from projecta11 import db
from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling
from projecta11.utils import require_session, parse_json_body, keys_filter


@handling(r"/score")
class NewScoreHandler(BaseHandler):
    @require_session
    @parse_json_body
    def put(self, data=None, sess=None):
        keys = ('score', 'user_id', 'class_id')
        data = keys_filter(data, keys)

        new_score = db.Score(**data)
        self.db.add(new_score)
        self.db.commit()

        self.finish(score_id=new_score.score_id)


@handling(r"/score/(\d+)")
class UpdateScoreHandler(BaseHandler):
    @require_session
    @parse_json_body
    def post(self, score_id, data=None, sess=None):
        keys = ('score_id', 'score')
        data = keys_filter(data, keys)

        self.db.query(db.Score).filter(
            db.Score.score_id == score_id).update(**data)
        self.db.commit()


@handling(r"/user/(\d+)/scores")
class UserScoresHandler(BaseHandler):
    @require_session
    def get(self, user_id, sess=None):
        selected = self.db.query(db.Score).filter(
            db.Score.user_id == user_id).all()

        list = []
        for score in selected:
            course_id = self.db.query(db.Class.course_id).filter(
                db.Class.class_id == score.class_id).first()[0]
            course = self.db.query(db.Course).filter(
                db.Course.course_id == course_id).first()

            list.append(dict(
                score_id=score.score_id,
                course_name=course.course_name,
                score=score.score,
                user_id=score.user_id,
                class_id=score.class_id))

        self.finish(list=list)
