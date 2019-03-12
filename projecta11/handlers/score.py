
from projecta11 import db
from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling
from projecta11.utils import require_session, parse_json_body, keys_filter

@handling(r"/user/(\d+)/scores")
class SpecificUserScoreInformationHandler(BaseHandler):
    @require_session
    def get(self, user_id, sess=None):
        selected = self.db.query(db.Score).filter(
            db.Score.user_id == user_id).all()
        if not selected:
            list = []
            self.finish(list=list)

        list = []
        for i in selected:
            dict = {
                'score_id': i.score_id,
                'course_name': i.course_name,
                'score': i.score,
                'user_id': i.user_id,
                'class_id': i.class_id}
            list.append(dict)

        self.finish(list=list)



@handling(r"/score/(\d+)")
class UpdateSpecificScore(BaseHandler):
    @require_session
    @parse_json_body
    def post(self, score_id, data=None, sess=None):
        keys = ('score_id', 'score', 'user_id', 'class_id', 'course_name')
        data = keys_filter(data, keys)
        self.db.query(db.Score).filter(db.Score.score_id == score_id).update(
            {'score_id': data['score_id'],
             'score': data['score'],
             'user_id': data['user_id'],
             'class_id': data['class_id'],
             'course_name': data['course_name']}
        )
        self.db.commit()



@handling(r"/scores")
class AddNewScores(BaseHandler):
    @require_session
    @parse_json_body
    def put(self, data=None, sess=None):
        keys = (
            'score', 'user_id', 'class_id', 'course_name'
        )
        data = keys_filter(data, keys)
        new_score = db.Score(**data)
        self.db.add(new_score)
        self.db.commit()

        self.finish(score_id=new_score.score_id)


@handling(r"/class/(\d+)/scores")
class AddNewScoresoofSpecificClass(BaseHandler):
    @require_session
    @parse_json_body
    def put(self, class_id=None, data=None, sess=None):
        keys = (
            'score', 'user_id'
        )
        data = keys_filter(data, keys)
        self.db.query(db.Score).filter(db.Score.class_id == class_id).update({
            'score': data['score'],
            'user_id': data['user_id']}
        )
        self.db.commit()