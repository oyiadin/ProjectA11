# coding=utf-8

import json

conf = None

class ObjectDict(dict):
    def __getattr__(self, item):
        value = self[item]
        if isinstance(value, dict):
            return ObjectDict(value)
        return value


def load_config(filename):
    global conf
    with open(filename) as f:
        loaded_config = ObjectDict(json.load(f))
        conf = loaded_config
        return conf
