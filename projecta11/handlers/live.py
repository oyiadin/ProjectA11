# coding=utf-8

import sqlalchemy
import projecta11.db as db
from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling
from projecta11.utils import require_session, role_in, parse_json_body, \
    keys_filter


@handling(r"/live/new")
class LiveCreateHandler(BaseHandler):
    @require_session
    @role_in(db.UserRole.teacher)
    @parse_json_body
    def put(self, data=None, sess=None):
        keys = ('title', 'introduction', 'start', 'duration', 'classes')
        data = keys_filter(data, keys)

        new_item = db.Live(
            title=data['title'],
            introduction=data['introduction'],
            start=data['start'],
            duration=data['duration'],
            is_streaming=False)
        self.db.add(new_item)
        self.db.commit()

        try:
            rels = []
            for _class in data['classes']:
                rels.append(db.RelationLiveClass(
                    live_id=new_item.live_id,
                    class_id=_class['class_id']))
            self.db.add_all(rels)
            self.db.commit()
        except sqlalchemy.exc.IntegrityError:
            self.db.delete(new_item)  # rollback
            return self.finish(404, 'no matched class_id')


@handling(r"/live/(\d+)")
class LiveInfoHandler(BaseHandler):
    def get(self, live_id):
        selected = self.db.query(db.Live).filter(
            db.Live.live_id == live_id).first()
        if selected is None:
            return self.finish(404, 'no matched live')

        return self.finish(dict(
            title=selected.title,
            introduction=selected.introduction,
            start=selected.start,
            duration=selected.duration,
            is_streaming=selected.is_streaming))

    @require_session
    @role_in(db.UserRole.teacher)
    @parse_json_body
    def post(self, live_id, data=None, sess=None):
        keys = ('title', 'introduction', 'start', 'duration', 'classes')
        data = keys_filter(data, keys)

        selected = self.db.query(db.Live).filter(
            db.Live.live_id == live_id).first()
        if selected is None:
            return self.finish(404, 'no matched live')

        selected.title=data['title'],
        selected.introduction=data['introduction'],
        selected.start=data['start'],
        selected.duration=data['duration'],

        try:
            rels = []
            for _class in data['classes']:
                rels.append(db.RelationLiveClass(
                    live_id=selected.live_id,
                    class_id=_class['class_id']))
            self.db.add_all(rels)
            self.db.commit()
        except sqlalchemy.exc.IntegrityError:
            # sqlalchemy would rollback automatically for us
            return self.finish(404, 'no matched class_id')


@handling(r"/live/(\d+)/start")
class LiveStartHandler(BaseHandler):
    @require_session
    def post(self, live_id):
        pass


@handling(r"/live/(\d+)/end")
class LiveEndHandler(BaseHandler):
    @require_session
    def post(self, live_id):
        pass
