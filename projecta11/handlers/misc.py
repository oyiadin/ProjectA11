# coding=utf-8

import io
import random
import time

from captcha.image import ImageCaptcha

from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling
from projecta11.config import conf
from projecta11.utils import require_session


_letter_cases = "acdefjkmprtwxy"
_upper_cases = _letter_cases.upper()
_numbers = '2348'
candidates = ''.join((_letter_cases, _upper_cases, _numbers))

captcha = ImageCaptcha()


@handling(r"/misc/captcha")
class CaptchaHandler(BaseHandler):
    @require_session
    def get(self, sess=None):
        code = ''.join(random.choices(candidates, k=4))
        image = captcha.generate_image(code)

        sess['captcha'] = code.lower()
        sess['captcha_expire'] = \
            int(time.time() + conf.session.captcha_expires_after)

        stream = io.BytesIO()
        image.save(stream, 'GIF')
        self.set_header('Content-Type', 'image/gif')
        self.write(stream.getvalue())
