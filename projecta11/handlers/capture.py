# coding=utf-8

from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling
from projecta11.handlers import check_code

import io


@handling(r"/check_code.*")
class CheckCodeHandler(BaseHandler):
    def get(self, *args, **kwargs):
        global CODE
        image, CODE = check_code.create_validate_code()
        # BytesIO操作二进制数据，将验证码图形写入内存
        mstream = io.BytesIO()
        image.save(mstream, 'GIF')
        self.write(mstream.getvalue())
