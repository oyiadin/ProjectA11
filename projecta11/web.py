# coding=utf-8

import hashlib

import projecta11.db as db

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
        self._session_db = None

    def _get_session_db(self):
        if self._session_db:
            return self._session_db
        self._session_db = db.Session()
        return self._session_db

    def _set_session_db(self, value):
        if self._session_db:
            self._session_db.close()
        self._session_db = value

    def _del_session_db(self):
        if self._session_db:
            self._session_db.close()
        self._session_db = None

    session_db = property(_get_session_db, _set_session_db, _del_session_db)

    def get_current_user(self):
        username = self.get_secure_cookie('username')
        if username is None:
            return None
        return self.session_db.query(db.User).filter(
            db.User.username == username).first()

    def render(self, *args, **kwargs):
        kwargs.update(dict(page=conf.page, conf=conf))
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
        self.redirect('/user_center')


class RegisterHandler(BaseHandler):
    def get(self):
        self.render("register.html")

    def post(self):
        username = self.get_argument('username')
        password = self.get_argument('password')
        name = self.get_argument('name')
        role = self.get_argument('role')

        if not (username and password and name and role):
            return self.write('all arguments are required!')
        if not role.isdigit():
            return self.write('role must be an integer!')
        role = int(role)
        if role >= len(db.UserRole.__members__):
            return self.write('illegal role value!')
        role = db.int2role[role]

        # hash the password
        password = self.hash_password(password)

        new_user = db.User(username=username, password=password,
                           name=name, role=role)
        self.session_db.add(new_user)
        self.session_db.commit()
        self.session_db.close()

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
    if conf.app.use_static_handler:
        routers.append((
            r"/static/(.*)", tornado.web.StaticFileHandler,
            {'path': conf.app.static_path}))

    app = tornado.web.Application(
        routers,
        debug=conf.app.debug,
        cookie_secret=conf.app.cookie_secret,
        template_path=conf.app.template_path,
        static_path=conf.app.static_path)
    app.listen(conf.app.port)
    tornado.ioloop.IOLoop.current().start()
