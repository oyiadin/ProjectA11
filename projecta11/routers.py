# coding=utf-8

import tornado.web
from projecta11.handlers import *

def get_routers(conf):
    routers = [
        (r"/", IndexHandler),
        (r"/register", RegisterHandler),
        (r"/login", LoginHandler),
        (r"/user_center", UserCenterHandler),
    ]
    if conf.app.use_static_handler:
        routers.append((
            r"/static/(.*)", tornado.web.StaticFileHandler,
            {'path': conf.app.static_path}))
    return routers
