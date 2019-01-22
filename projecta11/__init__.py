# coding=utf-8

import projecta11.db as db

import hashlib

import tornado.ioloop
import tornado.web

conf = None


def login_needed(f):
    def wrapper(self, *args, **kwargs):
        if self.current_user is None:
            self.redirect('/login')
        return f(self, *args, **kwargs)
    return wrapper


class BaseHandler(tornado.web.RequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._session = None

    def _get_session(self):
        if self._session:
            return self._session
        self._session = db.Session()
        return self._session

    def _set_session(self, value):
        if self._session:
            self._session.close()
        self._session = value

    def _del_session(self):
        if self._session:
            self._session.close()
        self._session = None

    session = property(_get_session, _set_session, _del_session)

    def get_current_user(self):
        username = self.get_secure_cookie('user')
        if username is None:
            return None
        return self.session.query(db.User).filter(db.User.name == username).one()

    def render(self, *args, **kwargs):
        kwargs.update(dict(page=conf.page))
        return super().render(*args, **kwargs)

    def hash_password(self, password):
        hashed = hashlib.sha256(password.encode()).hexdigest()
        salted = hashed + conf.app.password_salt
        hashed_and_salted = hashlib.sha256(salted.encode()).hexdigest()
        return hashed_and_salted


class IndexHandler(BaseHandler):
    def get(self):
        self.render("index.html")


class LoginHandler(BaseHandler):
    def get(self):
        self.render("login.html")

    def post(self):
        name = self.get_argument('name')
        password = self.get_argument('name')

        if not (name and password):
            return self.write('all arguments are required!')

        password = self.hash_password(password)

        selected_user = self.session.query(db.User).filter(
            db.User.name == name, db.User.password == password).first()
        if selected_user is None:
            return self.write('wrong username or password')

        self.set_secure_cookie('user', name)
        self.redirect('/user_center')


class RegisterHandler(BaseHandler):
    def get(self):
        self.render("register.html")

    def post(self):
        name = self.get_argument('name')
        password = self.get_argument('password')
        role = self.get_argument('role')

        if not (name and password and role):
            return self.write('all arguments are required!')
        if not role.isdigit():
            return self.write('role must be an integer!')
        role = int(role)
        if role >= len(db.User.int2role):
            return self.write('illegal role value!')

        # hash the password
        password = self.hash_password(password)

        new_user = db.User(name=name, password=password,
                           role=role)
        self.session.add(new_user)
        self.session.commit()
        self.session.close()

        self.redirect('/login')


class UserCenterHandler(BaseHandler):
    @login_needed
    def get(self):
        self.render("user_center.html", user=self.current_user)


def startup(_conf):
    global conf
    conf = _conf
    db.startup(conf)
    routers = [
        (r"/", IndexHandler),
        (r"/register", RegisterHandler),
        (r"/login", LoginHandler),
        (r"/user_center", UserCenterHandler),
    ]
    app = tornado.web.Application(
        routers,
        debug=conf.app.debug,
        template_path=conf.app.template_path,
        cookie_secret=conf.app.cookie_secret)
    app.listen(conf.app.port)
    tornado.ioloop.IOLoop.current().start()
