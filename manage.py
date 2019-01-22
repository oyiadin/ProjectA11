import json
import argparse

parser = argparse.ArgumentParser(description='project_a11')

parser.add_argument('--server', default=False, action='store_const', const=True)
parser.add_argument('--init', default=False, action='store_const', const=True)
parser.add_argument('--debug', default=False, action='store_const', const=True)
parser.add_argument('--config', default='config.json')


class ObjectDict(dict):
    def __getattr__(self, item):
        value = self[item]
        if isinstance(value, dict):
            return ObjectDict(value)
        return value


def load_config(filename):
    with open(filename) as f:
        loaded_config = json.load(f)
        return ObjectDict(loaded_config)


if __name__ == '__main__':
    args = parser.parse_args()
    conf = load_config(args.config)

    if args.debug:
        conf.app.update({'debug': True})

    try:
        if args.server:
            import projecta11.web
            projecta11.web.startup(conf)

        if args.init:
            import projecta11.db
            projecta11.db.init_db(conf)

    except KeyboardInterrupt:
        print('goodbye')
