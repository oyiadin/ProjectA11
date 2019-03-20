import argparse
import os

import projecta11.config as config

parser = argparse.ArgumentParser(description='project_a11')

parser.add_argument('--server',
                    default=False, action='store_const', const=True)
parser.add_argument('--init', default=False, action='store_const', const=True)
parser.add_argument('--reinit', default=False, action='store_const', const=True)
parser.add_argument('--debug', default=False, action='store_const', const=True)
parser.add_argument(
    '--use-static-handler', default=False, action='store_const', const=True)
parser.add_argument(
    '--swagger-ui', default=False, action='store_const', const=True)
parser.add_argument('--config', default='config.json')


if __name__ == '__main__':
    args = parser.parse_args()
    conf = config.load_config(args.config)

    if args.debug:
        conf.app.update({'debug': True})

    if args.use_static_handler:
        conf.app.update({'use_static_handler': True})

    if args.swagger_ui:
        conf.app.update({'swagger_ui': True})

    upload_dir = os.path.join(os.path.dirname(__file__), conf.app.upload_dir)
    try:
        os.mkdir(upload_dir)
    except FileExistsError:
        pass

    print('''remember to run celery worker server by running:
    celery -A projecta11.celery_tasks worker -b {} --loglevel=info''' \
        .format('redis://{}@{}:{}/{}'.format(
            conf.session.connection.password or '',
            conf.session.connection.host,
            conf.session.connection.port,
            conf.session.connection.db)))

    try:
        if args.server:
            import projecta11.server
            print('listening to http://{}:{}/'.format(
                conf.app.host, conf.app.port))
            if conf.app.swagger_ui:
                print('documentation lies here: http://{}:{}/api/v1/doc'.format(
                    conf.app.host, conf.app.port))
            projecta11.server.startup(conf)

        if args.reinit:
            import pymysql.cursors
            connection = pymysql.connect(host=conf.db.host,
                                         user=conf.db.user,
                                         password=conf.db.password)
            try:
                with connection.cursor() as cursor:
                    sql1 = "DROP DATABASE `%s`;" % conf.db.dbname
                    sql2 = "CREATE DATABASE `%s`;" % conf.db.dbname
                    try:
                        cursor.execute(sql1)
                    except pymysql.err.InternalError:
                        pass
                    cursor.execute(sql2)
                connection.commit()
                print('database droped!')
            finally:
                connection.close()

            import projecta11.db
            projecta11.db.init_db(conf)

        if args.init:
            import projecta11.db
            projecta11.db.init_db(conf)

    except KeyboardInterrupt:
        print('goodbye')
