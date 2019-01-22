import json
import argparse

parser = argparse.ArgumentParser(description='project_a11')

parser.add_argument('--server', default=False, action='store_const', const=True)
parser.add_argument('--db_init', default=False, action='store_const', const=True)
parser.add_argument('--config', default='config.json')


class ObjectDict(dict):
    def __getattr__(self, item):
        value = self[item]
        if isinstance(value, dict):
            return ObjectDict(value)
        return value


def load_config(filename):
    with open(filename) as f:
        default_config = dict(
            port=8888,
        )
        loaded_config = json.load(f)
        default_config.update(loaded_config)
        return ObjectDict(default_config)


if __name__ == '__main__':
    args = parser.parse_args()
    conf = load_config(args.config)

    try:
        if args.server:
            import projecta11
            projecta11.startup(conf)

        if args.db_init:
            import projecta11.db
            projecta11.db.init_db(conf)

    except KeyboardInterrupt:
        print('goodbye')
