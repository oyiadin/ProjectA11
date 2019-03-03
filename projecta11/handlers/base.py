# coding=utf-8
import traceback
import json

from tornado.escape import json_encode
import tornado.web
import projecta11.db as db
from projecta11.config import conf


class BaseHandler(tornado.web.RequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._session = None
        self._session_db = None

    def prepare(self):
        super().prepare()
        self.set_header('Content-Type', 'application/json')

    def _get_session_db(self):
        if self._session_db:
            return self._session_db
        self._session_db = db.Session()
        return self._session_db

    def _set_session_db(self, value):
        raise PermissionError("no manual db-session replacement")

    def _del_session_db(self):
        if self._session_db:
            self._session_db.close()
        self._session_db = None

    db_sess = property(_get_session_db, _set_session_db, _del_session_db)

    def finish(self, code=200, msg='OK', **kwargs):
        self.set_status(code)
        kwargs.update(msg=msg, code=code)
        ret = json_encode(kwargs) if not conf.app.debug \
            else json.dumps(kwargs, indent=2, sort_keys=True)
        return super().finish(ret)

    def write_error(self, status_code, **kwargs):
        self.set_header('Content-Type', 'application/json')
        if self.settings.get("serve_traceback") and "exc_info" in kwargs:
            # in debug mode, try to send a traceback
            self.set_header("Content-Type", "text/plain")
            lines = list(traceback.format_exception(*kwargs["exc_info"]))
            self.finish(status_code, self._reason, traceback=lines)
        else:
            self.finish(status_code, self._reason)


class Error404Handler(BaseHandler):
    def prepare(self):
        self.write_error(404)
