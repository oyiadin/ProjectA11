# coding=utf-8

def login_needed(f):
    def wrapper(self, *args, **kwargs):
        if self.current_user is None:
            self.redirect('/login')
        return f(self, *args, **kwargs)
    return wrapper
