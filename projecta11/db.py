# coding=utf-8

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, SmallInteger
from sqlalchemy.orm import sessionmaker

Base = declarative_base()
engine = None
Session = None


class User(Base):
    __tablename__ = "users"
    Id = Column(Integer, primary_key=True)
    Name = Column(String(8))
    Role = Column(SmallInteger)

    int2role = ['Admin', 'Teacher', 'Student']


def startup(conf):
    global engine, Session
    if engine and Session:
        return

    engine = create_engine(
        '{dialect}+{driver}://{user}:{password}@{host}/{dbname}'.format(
            **conf.db), echo=conf.debug)
    Session = sessionmaker(bind=engine)


def init_db(conf):
    startup(conf)
    Base.metadata.bind = engine
    Base.metadata.create_all()
