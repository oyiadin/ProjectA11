# coding=utf-8

from celery import Celery

import projecta11.db as db
import projecta11.config as config

config.load_config('config.json')
conf = config.conf

db.startup(conf)


broker='redis://:{}@{}:{}/{}'.format(
    conf.session.connection.password,
    conf.session.connection.host,
    conf.session.connection.port,
    conf.session.connection.db)
celery_app = Celery('celery_tasks', broker=broker)


@celery_app.task
def change_checkin_status(code_id):
    db_sess = db.Session()
    selected = db_sess.query(db.CheckedInLogs).filter(
        db.CheckedInLogs.code_id == code_id,
        db.CheckedInLogs.status == db.CheckedInStatus.awaiting).all()

    for i in selected:
        i.status = db.CheckedInStatus.absent

    db_sess.commit()
    db_sess.close()
    del db_sess

    print("code_id={}, {} students' status updated".format(
        code_id, len(selected)))


if __name__ == '__main__':
    celery_app.start()
