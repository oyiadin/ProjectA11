# coding=utf-8

import enum

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import (
    Column, Integer, String, CHAR, ARRAY, Enum, DateTime, Float)
from sqlalchemy.orm import sessionmaker

Base = declarative_base()
engine = None
Session = None

class UserRole(enum.Enum):
    admin = 0
    teacher = 1
    student = 2

int2role = [UserRole.admin, UserRole.teacher, UserRole.student]


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(16))
    password = Column(CHAR(64))  # only store sha256 hashed password
    name = Column(String(32))
    role = Column(Enum(UserRole))
    description = Column(String(1024))

    def __repr__(self):
        return '''<db.User
    id = {id},
    username={username},
    password={password},
    name={name},
    role={role},
    description={description}>'''.format(
            id=self.id, username=self.username, password=self.password,
            name=self.name, role=self.role, description=self.description)


# class CourseStatus(enum.Enum):
#     available = 0
#     pending = 1
#     ended = 2
#
#
# class Course(Base):
#     __tablename__ = "courses"
#     id = Column(Integer, primary_key=True)
#     course_name = Column(String(64))
#     description = Column(String(1024))
#     status = Column(Enum(CourseStatus))
#     start_time = Column(DateTime())
#     end_time = Column(DateTime())
#     credit = Column(Float())
#     teachers = Column(ARRAY(User.id))
#     students = Column(ARRAY(User.id))
#     # 似乎是数据库设计里边很常见的多对多关系，等我研究一下#


def startup(conf):
    global engine, Session
    if engine and Session:
        return

    engine = create_engine(
        '{dialect}+{driver}://{user}:{password}@{host}/{dbname}'.format(
            **conf.db), echo=conf.app.debug)
    Session = sessionmaker(bind=engine)


def init_db(conf):
    startup(conf)
    Base.metadata.bind = engine
    Base.metadata.create_all()
