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


base_dir = os.path.dirname(os.path.abspath(os.path.dirname(
    os.path.dirname(__file__))))
upload_dir = os.path.join(base_dir, conf.app.upload_dir)


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

        ret = dict(
            file_id=new_item.file_id,
            filename=new_item.filename,
            size=new_item.size,
            uploaded_at=new_item.uploaded_at,
            uploader_id=new_item.uploader_id)
        self.finish(**ret)


@handling(r"/(class|course)/(\d+)/materials/list")
class MaterialsListHandler(BaseHandler):
    @require_session
    def get(self, class_or_course, id, sess=None):
        belong_type = db.BelongType.CLASS if class_or_course == 'class' \
            else db.BelongType.COURSE
        selected = self.db.query(db.Material).filter(
            db.Material.belong_type == belong_type,
            db.Material.belong_id == id).all()

        list = []
        for i in selected:
            list.append(dict(
                file_id=i.file_id,
                filename=i.filename,
                size=i.size,
                uploaded_at=i.uploaded_at,
                uploader_id=i.uploader_id))

        self.finish(list=list)


@handling(r"/material/(\d+)")
class MaterialDownloadHandler(BaseHandler):
    @require_session
    def get(self, file_id, sess=None):
        selected  = self.db.query(db.Material).filter(
            db.Material.file_id == file_id).first()
        if selected is None:
            return self.finish(404, 'no such file')

        self.set_header('Content-Type', 'application/octet-stream')

        with open(os.path.join(
                upload_dir, selected.internal_filename), 'rb') as f:
            self.write(f.read())

        self.finish(no_json=True)

    @require_session
    def delete(self, file_id, sess=None):
        selected = self.db.query(db.Material).filter(
            db.Material.file_id == file_id).first()
        if selected is None:
            return self.finish(404, 'no such file')

        self.db.delete(selected)
        self.db.commit()

        os.remove(os.path.join(upload_dir, selected.internal_filename))
