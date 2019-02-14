# coding=utf-8

import tornado.web


name2pattern = {
    '404': r"/404",
    'check_code': r"/check_code",
    'class_show': r"/classes/show/([0-9]+)",
    'class_create': r"/classes/create",
    'index': r"/",
    'login': r"/login",
    'logout': r"/logout",
    'register': r"/register",
    'user_center': r"/user_center",
}
routers = []


def handling(name):
    def decorator(handler):
        routers.append((name2pattern[name], handler))
        return handler
    return decorator


def get_routers(conf):
    if conf.app.use_static_handler:
        routers.append((
            r"/static/(.*)", tornado.web.StaticFileHandler,
            {'path': conf.app.static_path}))
    return routers

def url(name):
    return name2pattern.get(name, '/404')
