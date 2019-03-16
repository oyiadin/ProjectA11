# coding=utf-8

import enum

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import (
    Column, Integer, String, CHAR, SmallInteger, ForeignKey, Boolean, Enum
)
from sqlalchemy.orm import sessionmaker

Base = declarative_base()
engine = None
Session = None


class UserRole(enum.Enum):
    student = 0
    teacher = 1
    admin = 2

int2UserRole = [UserRole.student, UserRole.teacher, UserRole.admin]


class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True)
    staff_id = Column(Integer)
    role = Column(Enum(UserRole))
    name = Column(String(32))
    is_male = Column(Boolean)
    password = Column(CHAR(64))  # only store sha256 hashed password


class Course(Base):
    __tablename__ = "courses"
    course_id = Column(Integer, primary_key=True)
    course_name = Column(String(96))
    start = Column(Integer)
    end = Column(Integer)


class Class(Base):
    __tablename__ = 'classes'
    class_id = Column(Integer, primary_key=True)
    class_name = Column(String(96))
    weekday = Column(SmallInteger)  # 周几
    start = Column(SmallInteger)  # 第几节课开始
    end = Column(SmallInteger)  # 第几节课结束
    teacher_id = Column(Integer, ForeignKey(User.user_id))
    course_id = Column(Integer, ForeignKey(Course.course_id))

class Score(Base):
    __tablename__ = 'scores'
    score_id = Column(Integer, primary_key=True)
    score = Column(Integer)
    user_id = Column(Integer, ForeignKey(User.user_id))
    class_id = Column(Integer, ForeignKey(Class.class_id))


class RelationUserClass(Base):  # 用户(学生)与班级的关系表
    __tablename__ = 'relation_user_class'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(User.user_id))
    class_id = Column(Integer, ForeignKey(Class.class_id))


class CheckInCodes(Base):
    __tablename__ = "check-in-codes"
    code_id = Column(Integer, primary_key=True)
    code = Column(SmallInteger)
    class_id = Column(Integer, ForeignKey(Class.class_id))
    started = Column(Boolean)
    expire_at = Column(Integer)


class CheckedInLogs(Base):
    __tablename__ = "checked-in-logs"
    log_id = Column(Integer, primary_key=True)
    code_id = Column(Integer, ForeignKey(CheckInCodes.code_id))
    user_id = Column(Integer, ForeignKey(User.user_id))


class BelongType(enum.Enum):
    CLASS = 0
    COURSE = 1


class Material(Base):
    __tablename__ = "materials"
    file_id = Column(Integer, primary_key=True)
    filename = Column(String(64))
    internal_filename = Column(String(64))
    size = Column(Integer)
    uploaded_at = Column(Integer)
    uploader_id = Column(Integer, ForeignKey(User.user_id))
    belong_type = Column(Enum(BelongType))
    belong_id = Column(Integer)


class Topic(Base):
    __tablename__ = "topics"
    topic_id = Column(Integer, primary_key=True)
    title = Column(String(64))
    content = Column(String(4096))
    user_id = Column(Integer, ForeignKey(User.user_id))
    created_at = Column(Integer)
    updated_at = Column(Integer)
    replies = Column(Integer)
    belong_type = Column(Enum(BelongType))
    belong_id = Column(Integer)


class Reply(Base):
    __tablename__ = "replies"
    reply_id = Column(Integer, primary_key=True)
    topic_id = Column(Integer, ForeignKey(Topic.topic_id))
    content = Column(String(4096))
    user_id = Column(Integer, ForeignKey(User.user_id))
    created_at = Column(Integer)


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

    if conf.app.debug:
        sess = Session()
        user1 = User(
            staff_id=17052100,
            role=UserRole.teacher,
            name="陈老师",
            is_male=True,
            password='702ca6f0e58e2d8ddf98228d59e2efc6e19e82fd0858ee948289948f42d86232')
        user2 = User(
            staff_id=17052101,
            role=UserRole.student,
            name="陈学生",
            is_male=False,
            password='c203aa9c9171287d4a7356006646257866e9a5b6f2bea957ae7b0e1a30a07dfa')
        user3 = User(
            staff_id=10000,
            role=UserRole.admin,
            name="陈管理员",
            is_male=True,
            password='bede0c4938ce392d4a96b9743140e64954505b1973b08e386e74ac5bc963980d')
        sess.add_all([user1, user2, user3])
        sess.commit()

        course1 = Course(
            course_name="高等数学",
            start=1552706506,
            end=1552806506)
        course2 = Course(
            course_name="离散数学",
            start=1552704506,
            end=1552816506)
        sess.add_all([course1, course2])
        sess.commit()

        class11 = Class(class_name="周一上午", weekday=1, start=3, end=5,
                        teacher_id=1, course_id=1)
        class12 = Class(class_name="周三下午", weekday=3, start=6, end=8,
                        teacher_id=1, course_id=1)
        class21 = Class(class_name="周二上午", weekday=2, start=1, end=2,
                        teacher_id=1, course_id=2)
        class22 = Class(class_name="周三下午", weekday=3, start=6, end=7,
                        teacher_id=1, course_id=2)
        sess.add_all([class11, class12, class21, class22])
        sess.commit()

        score1 = Score(score=95, user_id=2, class_id=1)
        score2 = Score(score=98, user_id=2, class_id=3)
        sess.add_all([score1, score2])
        sess.commit()

        rel1 = RelationUserClass(user_id=2, class_id=1)
        sess.add_all([rel1])
        sess.commit()

        code1 = CheckInCodes(
            code=1234, class_id=1, started=1, expire_at=1552707168)
        sess.add_all([code1])
        sess.commit()

        log1 = CheckedInLogs(code_id=1, user_id=2)
        sess.add_all([log1])
        sess.commit()

        material1 = Material(
            filename="高等数学课程培养方案.doc",
            internal_filename="no such a file",
            size=0,
            uploaded_at=1552707319,
            uploader_id=1,
            belong_type=BelongType.COURSE,
            belong_id=1)
        material2 = Material(
            filename="第一章.ppt",
            internal_filename="no such a file",
            size=0,
            uploaded_at=1552707390,
            uploader_id=1,
            belong_type=BelongType.CLASS,
            belong_id=1)
        sess.add_all([material1, material2])
        sess.commit()

        topic1 = Topic(
            title="高数好难啊",
            content="如题，真的好难啊",
            user_id=2,
            created_at=1552707468,
            updated_at=1552707582,
            replies=2,
            belong_type=BelongType.COURSE,
            belong_id=1)
        sess.add_all([topic1])
        sess.commit()

        reply1 = Reply(
            topic_id=1,
            content="附议！好难！",
            user_id=2,
            created_at=1552707554)
        reply2 = Reply(
            topic_id=1,
            content="你挂了",
            user_id=1,
            created_at=1552707582)
        sess.add_all([reply1, reply2])
        sess.commit()

        sess.close()
