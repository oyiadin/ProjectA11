# coding=utf-8

import io
import random
import time

from captcha.image import ImageCaptcha

from projecta11.config import conf
from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling
from projecta11.utils import require_session, parse_json_body, keys_filter

_letter_cases = "acdefjkmprtwxy"
_upper_cases = _letter_cases.upper()
_numbers = '2348' * 3  # 稍微提高一下出现数字的概率…
candidates = ''.join((_letter_cases, _upper_cases, _numbers))

captcha = ImageCaptcha()

available_app_id = (
    '0cc175b9c0f1b6a8',  # register
    '9c15af0d3e0ea84d',  # login
    'a97754bc483c6de5',  # check-in
)


@handling(r"/misc/captcha")
class CaptchaHandler(BaseHandler):
    @require_session
    @parse_json_body
    def post(self, data=None, sess=None):
        app_id = data.get('app_id')

        if app_id is None:
            return self.finish(400, 'app_id is required')

        if app_id not in available_app_id:
            return self.finish(400, 'illegal app_id')

        code = ''.join(random.choices(candidates, k=4))
        image = captcha.generate_image(code)

        sess.set(
            'captcha:' + app_id, code.lower(),
            expire_at=int(time.time() + conf.session.captcha_expires_after))
        stream = io.BytesIO()
        image.save(stream, 'JPEG')
        self.set_header('Content-Type', 'image/jpeg')
        self.write(stream.getvalue())
