# coding=utf-8
import traceback
import json

import tornado.web
import projecta11.db as db
from projecta11.config import conf


class BaseHandler(tornado.web.RequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._session = None
        self._session_db = None

    def _get_db_session(self):
        if self._session_db:
            return self._session_db
        self._session_db = db.Session()
        return self._session_db

    def _set_db_session(self, value):
        raise PermissionError("no manual db-session replacement")

    def _del_db_session(self):
        if self._session_db:
            self._session_db.close()
        self._session_db = None

    db = property(_get_db_session, _set_db_session, _del_db_session)

    def finish(self, status_code=200, msg=None, no_json=False, **kwargs):
        self.set_status(status_code)

        if no_json:
            return super().finish()

        self.set_header('Content-Type', 'application/json')

        if msg is None:
            msg = self._reason

        kwargs.update(msg=msg, status_code=status_code)
        value = kwargs

        kwargs = dict(indent=2, sort_keys=True) if conf.app.debug else {}
        ret = json.dumps(
            value, default=str, **kwargs).replace("</", "<\\/")
        return super().finish(ret)

    def write_error(self, status_code, **kwargs):
        self.set_header('Content-Type', 'application/json')
        if self.settings.get("serve_traceback") and "exc_info" in kwargs:
            # in debug mode, try to send a traceback
            lines = list(traceback.format_exception(*kwargs["exc_info"]))
            self.finish(status_code, self._reason, traceback=lines)
        else:
            self.finish(status_code, self._reason)


class Error404Handler(BaseHandler):
    def prepare(self):
        self.write_error(404)
