# coding=utf-8
import hashlib
import os
import time
import uuid

from projecta11 import db
from projecta11.config import conf
from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling
from projecta11.utils import require_session


@handling(r"/(class|course)/(\d+)/material")
class MaterialUploadHandler(BaseHandler):
    @require_session
    def post(self, class_or_course, id, sess=None):
        belong_type = db.BelongType.CLASS if class_or_course == 'class' \
            else db.BelongType.COURSE
        file_metas = self.request.files['file']

        if len(file_metas) >= 2:
            return self.finish(400, 'one file per times')

        meta = file_metas[0]
        internal_filename = str(uuid.uuid4())
        prev_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
        upload_dir = os.path.join(prev_dir, conf.app.upload_dir)
        with open(os.path.join(upload_dir, internal_filename), 'wb') as f:
            f.write(meta['body'])

        new_item = db.Material(
            filename=meta['filename'],
            internal_filename=internal_filename,
            size=len(meta['body']),
            uploaded_at=int(time.time()),
            uploader_id=sess['user_id'],
            belong_type=belong_type,
            belong_id=int(id))
        self.db.add(new_item)
        self.db.commit()
