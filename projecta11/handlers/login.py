# coding=utf-8

from projecta11.handlers.base import BaseHandler
import projecta11.utils.db as db
from projecta11.routers import handling, url


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

        selected_user = self.session_db.query(db.User).filter(
            db.User.username == username, db.User.password == password).first()
        if selected_user is None:
            return self.write('wrong username or password')

        self.set_secure_cookie('username', username)
        self.redirect(url('user_center'))
