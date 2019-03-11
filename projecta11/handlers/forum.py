# coding=utf-8
import time

from projecta11 import db
from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling
from projecta11.utils import require_session, parse_json_body, keys_filter


@handling(r"/(class|course)/(\d+)/forum/topic")
class TopicCreateHandler(BaseHandler):
    @require_session
    @parse_json_body
    def put(self, class_or_course, id, data=None, sess=None):
        belong_type = db.BelongType.CLASS if class_or_course == 'class' \
            else db.BelongType.COURSE

        keys = ('title', 'content')
        data = keys_filter(data, keys)

        at = int(time.time())

        new_item = db.Topic(
            title=data['title'],
            content=data['content'],
            user_id=sess['user_id'],
            created_at=at,
            updated_at=at,
            replies=0,
            belong_type=belong_type,
            belong_id=id)
        self.db.add(new_item)
        self.db.commit()

        self.finish(topic_id=new_item.topic_id)


@handling(r"/(class|course)/(\d+)/forum/topic/(\d+)")
class TopicInfoHandler(BaseHandler):
    @require_session
    def get(self, class_or_course, id, topic_id, sess=None):
        belong_type = db.BelongType.CLASS if class_or_course == 'class' \
            else db.BelongType.COURSE

        selected = self.db.query(db.Topic).filter(
            db.Topic.topic_id == topic_id).first()
        if selected is None:
            return self.finish(404, 'no such topic')

        ret = dict(
            topic_id=selected.topic_id,
            title=selected.title,
            content=selected.content,
            user_id=selected.user_id,
            created_at=selected.created_at,
            updated_at=selected.updated_at,
            replies=selected.replies)
        self.finish(**ret)


@handling(r"/(class|course)/(\d+)/forum/topics/list")
class TopicListHandler(BaseHandler):
    @require_session
    def get(self, class_or_course, id, sess=None):
        belong_type = db.BelongType.CLASS if class_or_course == 'class' \
            else db.BelongType.COURSE

        selected = self.db.query(db.Topic).filter(
            db.Topic.belong_type == belong_type,
            db.Topic.belong_id == id).all()
        if len(selected) == 0:
            return self.finish(404, 'no such topic')

        list = []
        for topic in selected:
            list.append(dict(
                topic_id=topic.topic_id,
                title=topic.title,
                content=topic.content,
                user_id=topic.user_id,
                created_at=topic.created_at,
                updated_at=topic.updated_at,
                replies=topic.replies))

        self.finish(list=list)


@handling(r"/(class|course)/(\d+)/forum/topic/(\d+)/reply")
class NewReplyHandler(BaseHandler):
    @require_session
    @parse_json_body
    def put(self, class_or_course, id, topic_id, data=None, sess=None):
        keys = ('content',)
        data = keys_filter(data, keys)

        new_item = db.Reply(
            topic_id=topic_id,
            content=data['content'],
            user_id=sess['user_id'],
            created_at=int(time.time()))
        self.db.add(new_item)
        self.db.commit()


@handling(r"/(class|course)/(\d+)/forum/topic/(\d+)/replies")
class RepliesListHandler(BaseHandler):
    @require_session
    def get(self, class_or_course, id, topic_id, sess=None):
        selected = self.db.query(db.Reply).filter(
            db.Reply.topic_id == topic_id).all()
        if len(selected) == 0:
            return self.finish(404, 'no such replies')

        list = []
        for reply in selected:
            list.append(dict(
            reply_id = reply.reply_id,
            content = reply.content,
            user_id = reply.user_id,
            created_at = reply.created_at))

        self.finish(list=list)
