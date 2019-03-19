# coding=utf-8
import time
import hashlib
import sqlalchemy

import projecta11.db as db
from projecta11.config import conf
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
        keys = (
            'title', 'introduction', 'start', 'duration', 'classes',
            'is_public'
        )
        data = keys_filter(data, keys)

        new_item = db.Live(
            title=data['title'],
            user_id=sess['user_id'],
            introduction=data['introduction'],
            start=data['start'],
            duration=data['duration'],
            is_public=data['is_public'],
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
            user_id=selected.user_id,
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

        selected.title = data['title'],
        selected.introduction = data['introduction'],
        selected.start = data['start'],
        selected.duration = data['duration'],

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


@handling(r"/user/(\d+)/live/list")
class UserLiveListHandler(BaseHandler):
    @require_session
    @role_in(db.UserRole.teacher)
    def get(self, user_id, sess=None):
        selected = self.db.query(db.Live).filter(
            db.Live.user_id == user_id).all()

        list = []
        for live in selected:
            list.append(dict(
                title=live.title,
                brief=live.introduction[:20],
                start=live.start,
                duration=live.duration,
                is_streaming=live.is_streaming))
        self.finish(total=len(list), list=list)


@handling(r"/live/(\d+)/start")
class LiveStartHandler(BaseHandler):
    @require_session
    @role_in(db.UserRole.teacher)
    def get(self, live_id, sess=None):
        selected = self.db.query(db.Live).filter(
            db.Live.live_id == live_id).first()
        if selected is None:
            return self.finish(404, 'no matched live')

        if selected.is_streaming:
            return self.finish(405, 'the live is currently streaming')

        selected.is_streaming = True
        self.db.commit()

        stream_name = 'u{}s{}'.format(sess['user_id'].decode(), live_id)
        tx_time = hex(int(time.time()) + 86400)[2:].upper()  # 24h
        tx_secret = hashlib.md5(
            (conf.app.livepush_secret + stream_name + tx_time).encode()
        ).hexdigest()

        self.finish(url='rmtp://{}/live/{}?txSecret={}&txTime={}'.format(
            conf.app.livepush_domain, stream_name, tx_secret, tx_time))


@handling(r"/live/(\d+)/end")
class LiveEndHandler(BaseHandler):
    @require_session
    @role_in(db.UserRole.teacher)
    def post(self, live_id, sess=None):
        selected = self.db.query(db.Live).filter(
            db.Live.live_id == live_id).first()
        if selected is None:
            return self.finish(404, 'no matched live')

        if not selected.is_streaming:
            return self.finish(405, "the live isn't currently streaming")

        selected.is_streaming = False
        self.db.commit()
