# coding=utf-8

from projecta11.handlers.base import BaseHandler
from projecta11.routers import handling, url
from projecta11.utils.config import conf
import projecta11.utils.db as db


@handling('login', r"/login")
class LoginHandler(BaseHandler):
    def get(self):
        self.render("users/login.html")

    def post(self):
        username = self.get_argument('username')
        password = self.get_argument('password')

        if not (username and password):
            return self.write('all arguments are required!')

        password = self.hash_password(password)

        selected_user = self.db_sess.query(db.User).filter(
            db.User.username == username, db.User.password == password).first()
        if selected_user is None:
            return self.write('wrong username or password')

        self.sess['is_login'] = 1
        self.sess['username'] = username
        self.sess.expire(conf.session.expires_after)

        # TODO: 加上其他检测，防止 session 被盗用，以及保证仅单 session 有效

        self.redirect(url('user_center'))
