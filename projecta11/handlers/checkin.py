# coding=utf-8
import time
import random

import projecta11.db as db
from projecta11.config import conf
from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling
from projecta11.utils import require_session, parse_json_body, keys_filter


@handling(r"/check-in/class/(\d+)/code")
class FetchCheckinCode(BaseHandler):
    @require_session
    def get(self, class_id, sess=None):
        class_id = int(class_id)
        code = random.randint(1000, 9999)
        data = dict(
            code=code,
            class_id=class_id,
            started=False,
            expire_at=int(time.time())
        )
        new_code = db.CheckinCodes(**data)

        self.db.add(new_code)
        self.db.commit()

        sess.r.hmset(
            'checkin:{}'.format(code),
            dict(code_id=new_code.code_id, code=code, class_id=class_id,
                 started=0))

        ret = dict(
            code_id=new_code.code_id,
            code=code)

        self.finish(**ret)


@handling(r"/check-in/code/(\d+)/start")
class StartCheckin(BaseHandler):
    @require_session
    def post(self, code_id, sess=None):

        selected = self.db.query(db.CheckinCodes).filter(
            db.CheckinCodes.code_id == code_id).first()
        if selected is None:
            return self.finish(400)

        key = 'checkin:{}'.format(selected.code)

        sess.r.hmset(key, {'started': 1})
        sess.r.expire(key, conf.session.checkin_code_expires_after)

        self.finish()


@handling(r"/check-in/verify/(\d+)")
class VerifyCheckinCode(BaseHandler):
    @require_session
    def put(self, code, sess=None):
        key = 'checkin:{}'.format(code)

        if sess.r.exists(key) and int(sess.r.hget(key, 'started')) == 1:
            new_log = db.CheckedInLogs(
                code_id=sess.r.hget(key, 'code_id'), user_id=sess['user_id'])
            self.db.add(new_log)
            self.db.commit()

            self.finish()

        else:
            self.finish(404, 'invalid check-in code')
