# coding=utf-8

import os

import tornado.ioloop
import tornado.web
import tornado.locale

import projecta11.utils.config as config
import projecta11.utils.db as db
import projecta11.routers as routers
import projecta11.handlers
# 不能删，handlers 得被载入才会注册好对应的 url pattern


def startup(conf):
    config.conf = conf
    db.startup(conf)

    prev_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    locales_dir = os.path.join(prev_dir, 'locales')
    tornado.locale.load_translations(locales_dir)
    tornado.locale.set_default_locale('zh_CN')

    app = tornado.web.Application(
        routers.get_routers(conf),
        debug=conf.app.debug,
        cookie_secret=conf.app.cookie_secret,
        template_path=conf.app.template_path,
        static_path=conf.app.static_path)
    app.listen(conf.app.port)
    tornado.ioloop.IOLoop.current().start()
