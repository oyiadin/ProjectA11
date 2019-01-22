# coding=utf-8

import projecta11.db as db

import tornado.ioloop
import tornado.web

conf = None


class BaseHandler(tornado.web.RequestHandler):
    pass
    # 为了以后拓展方便


class IndexHandler(BaseHandler):
    def get(self):
        self.render("index.html", page=conf.page)


def startup(_conf):
    global conf
    conf = _conf
    db.startup(conf)
    routers = [
        (r"/", IndexHandler),
    ]
    app = tornado.web.Application(
        routers,
        debug=conf.debug,
        template_path=conf.template_path)
    app.listen(conf.port)
    tornado.ioloop.IOLoop.current().start()
