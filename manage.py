import argparse
import projecta11.utils.config as config

parser = argparse.ArgumentParser(description='project_a11')

parser.add_argument('--server',
                    default=False, action='store_const', const=True)
parser.add_argument('--init', default=False, action='store_const', const=True)
parser.add_argument('--debug', default=False, action='store_const', const=True)
parser.add_argument(
    '--use_static_handler', default=False, action='store_const', const=True)
parser.add_argument('--config', default='config.json')


if __name__ == '__main__':
    args = parser.parse_args()
    conf = config.load_config(args.config)

    if args.debug:
        conf.app.update({'debug': True})

    if args.use_static_handler:
        conf.app.update({'use_static_handler': True})

    try:
        if args.server:
            import projecta11.server
            projecta11.server.startup(conf)

        if args.init:
            import projecta11.utils.db
            projecta11.utils.db.init_db(conf)

    except KeyboardInterrupt:
        print('goodbye')
