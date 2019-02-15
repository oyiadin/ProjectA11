# coding=utf-8

import tornado.web


name2pattern = {}
routers = []


def handling(name, pattern):
    def decorator(handler):
        if name in name2pattern:
            raise AttributeError("same pattern name `{}` occurred "
                                 "for the second time".format(name))
        name2pattern[name] = pattern
        routers.append((pattern, handler))
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
