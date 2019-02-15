# coding=utf-8

from projecta11.handlers.index import IndexHandler
from projecta11.handlers.register import RegisterHandler
from projecta11.handlers.login import LoginHandler
from projecta11.handlers.logout import LogoutHandler
from projecta11.handlers.user_center import UserCenterHandler
from projecta11.handlers.classes import ClassShowHandler, ClassCreateHandler
from projecta11.handlers.capture import CheckCodeHandler
from projecta11.handlers.error import Error404Handler

from projecta11.utils.config import conf
if conf.app.debug:
    from projecta11.handlers.convenience import FrontendAnyPageHandler
