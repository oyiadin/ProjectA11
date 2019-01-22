# coding=utf-8

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker


Base = declarative_base()
engine = None
Session = None


class Car(Base):
    __tablename__ = "Cars"

    Id = Column(Integer, primary_key=True)
    Name = Column(String)
    Price = Column(Integer)


def startup(conf):
    global engine, Session

    if engine and Session:
        return

    engine = create_engine('sqlite:///:memory:')
    Session = sessionmaker(bind=engine)


def init_db(conf):
    Base.metadata.bind = engine
    Base.metadata.create_all()
