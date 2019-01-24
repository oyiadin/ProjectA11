# coding=utf-8

import tornado.web

routers = []


def handling(pattern):
    def decorator(handler):
        routers.append((pattern, handler))
        return handler
    return decorator

def get_routers(conf):
    if conf.app.use_static_handler:
        routers.append((
            r"/static/(.*)", tornado.web.StaticFileHandler,
            {'path': conf.app.static_path}))
    return routers
