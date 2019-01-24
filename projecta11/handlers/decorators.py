# coding=utf-8

import projecta11.utils.db as db

def login_needed(func):
    def wrapper(self, *args, **kwargs):
        if self.current_user is None:
            self.redirect('/login')
        return func(self, *args, **kwargs)
    return wrapper

def role_assert(*roles):
    def decorator(func):
        def wrapper(self, *args, **kwargs):
            if self.current_user is None:
                self.redirect('/login')
            else:
                for role in roles:
                    if db.string2role[role] == self.current_user.role:
                        return func(self, *args, **kwargs)
                    self.redirect('/login')
        return wrapper
    return decorator