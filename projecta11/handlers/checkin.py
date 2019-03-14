# coding=utf-8
from json import JSONDecodeError

import sqlalchemy
import time
import random

from tornado.escape import json_decode

import projecta11.db as db
from projecta11.config import conf
from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling
from projecta11.utils import require_session, parse_json_body, keys_filter


@handling(r"/check-in/class/(\d+)/code")
class NewCheckInCodeHandler(BaseHandler):
    @require_session
    def get(self, class_id, sess=None):
        code = random.randint(1000, 9999)
        new_code = db.CheckinCodes(
            code=code,
            class_id=class_id,
            started=False,
            expire_at=int(time.time()))

        self.db.add(new_code)
        try:
            self.db.commit()
        except sqlalchemy.exc.IntegrityError:
            return self.finish(404, 'no matched class_id')

        key = 'checkin:{}'.format(code)
        sess.r.hmset(key, dict(
            code_id=new_code.code_id, class_id=class_id, started=0))

        ret = dict(code_id=new_code.code_id, code=code)
        self.finish(**ret)


@handling(r"/check-in/code/(\d+)/start")
class StartCheckInHandler(BaseHandler):
    @require_session
    @parse_json_body
    def post(self, code_id, data=None, sess=None):
        selected = self.db.query(db.CheckinCodes).filter(
            db.CheckinCodes.code_id == code_id).first()
        if selected is None:
            return self.finish(404, 'no matched code_id')

        try:
            wifi_list = json_decode(data['wifi_list'])
        except JSONDecodeError:
            return self.finish(400, 'bad request')

        print(wifi_list)

        key = 'checkin:{}'.format(selected.code)

        sess.r.hmset(key, {'started': 1})
        sess.r.expire(key, conf.session.checkin_code_expires_after)


@handling(r"/check-in/verify/(\d+)")
class VerifyCheckInCodeHandler(BaseHandler):
    @require_session
    def put(self, code, sess=None):
        key = 'checkin:{}'.format(code)

        if sess.r.exists(key) and int(sess.r.hget(key, 'started')) == 1:
            new_log = db.CheckedInLogs(
                code_id=sess.r.hget(key, 'code_id'), user_id=sess['user_id'])
            self.db.add(new_log)
            self.db.commit()
        else:
            self.finish(404, 'invalid check-in code')


@handling(r"/check-in/verify/code/(\d+)/user/(\d+)")
class CheckInManuallyHandler(BaseHandler):
    @require_session
    def post(self, code_id, user_id, sess=None):
        if self.db.query(db.User).filter(
            db.User.user_id == user_id).first() == None:
            return self.finish(404, 'no such a user_id')

        new_log = db.CheckedInLogs(code_id=code_id, user_id=user_id)
        self.db.add(new_log)
        self.db.commit()


@handling(r"/check-in/code/(\d+)/list")
class CheckedInListHandler(BaseHandler):
    @require_session
    def get(self, code_id, sess=None):
        selected = self.db.query(db.CheckedInLogs).filter(
            db.CheckedInLogs.code_id == code_id).all()

        list = []
        for i in selected:
            user = self.db.query(db.User).filter(
                db.User.user_id == i.user_id).first()
            list.append(dict(
                user_id=user.user_id,
                staff_id=user.staff_id))

        self.finish(list=list)
