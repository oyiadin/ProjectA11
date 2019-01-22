# coding=utf-8

import projecta11.db as db

import tornado.ioloop
import tornado.web


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")


def startup(conf):
    db.startup(conf)
    app = tornado.web.Application([
        (r"/", MainHandler),
    ])
    app.listen(conf.port)
    tornado.ioloop.IOLoop.current().start()
