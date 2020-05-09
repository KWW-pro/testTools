from sqlalchemy.orm import scoped_session
from sqlalchemy import Column, String, create_engine, Integer, TIMESTAMP, Float, LargeBinary, func, ForeignKey, DATE, Text, CLOB
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.engine.url import URL

class ModelMixin(object):
    @classmethod
    def get_by_id(self, cls, session, id, columns=None, lock_mode=None):
        if hasattr(cls, 'id'):
            scalar = False
            if columns:
                if isinstance(columns, (tuple, list)):
                    query = session.query(*columns)
                else:
                    scalar = True
                    query = session.query(columns)
            else:
                query = session.query(cls)
            if lock_mode:
                query = query.with_lockmode(lock_mode)
            query = query.filter(cls.id == id)
            if scalar:
                return query.scalar()
            return query.first()
        return None
    #Base.get_by_id = get_by_id

    @classmethod
    def get_all(self, cls, session, columns=None, offset=None, limit=None, order_by=None, lock_mode=None):
        if columns:
            if isinstance(columns, (tuple, list)):
                query = session.query(*columns)
            else:
                query = session.query(columns)
                if isinstance(columns, str):
                    query = query.select_from(cls)
        else:
            query = session.query(cls)
        if order_by is not None:
            if isinstance(order_by, (tuple, list)):
                query = query.order_by(*order_by)
            else:
                query = query.order_by(order_by)
        if offset:
            query = query.offset(offset)
        if limit:
            query = query.limit(limit)
        if lock_mode:
            query = query.with_lockmode(lock_mode)
        return query.all()
    #Base.get_all = get_all

    @classmethod
    def count_all(self, cls, session, lock_mode=None):
        query = session.query(func.count('*')).select_from(cls)
        if lock_mode:
            query = query.with_lockmode(lock_mode)
        return query.scalar()
    #Base.count_all = count_all

    @classmethod
    def exist(self, cls, session, id, lock_mode=None):
        if hasattr(cls, 'id'):
            query = session.query(func.count('*')).select_from(cls).filter(cls.id == id)
            if lock_mode:
                query = query.with_lockmode(lock_mode)
            return query.scalar() > 0
        return False
    #BaseModel.exist = exist

    @classmethod
    def set_attr(self, cls, session, id, attr, value):
        if hasattr(cls, 'id'):
            session.query(cls).filter(cls.id == id).update({
                attr: value
            })
            session.commit()
    #BaseModel.set_attr = set_attr

    @classmethod
    def set_attrs(self, cls, session, id, attrs):
        if hasattr(cls, 'id'):
            session.query(cls).filter(cls.id == id).update(attrs)
            session.commit()
    #Base.set_attrs = set_attrs

BaseModel = declarative_base(cls=ModelMixin)

class TESTTASK(BaseModel):
    # 表的名字:
    __tablename__ = 'TEST_TASK'

    # 表的结构:
    ID = Column(Integer, primary_key=True, nullable=False)
    TASK_ID = Column(String(255), nullable=False)
    TASK_SERVICE = Column(String(255))
    TASK_DATE = Column(String(255))
    DATA_JSON = Column(Text)

class REDISINFO(BaseModel):
    # 表的名字:
    __tablename__ = 'REDIS_INFO'

    # 表的结构:
    ID = Column(Integer, primary_key=True, nullable=False)
    TASK_ID = Column(String(255), nullable=False)
    INFO_DATE = Column(String(255))
    USED_MEMORY_RSS = Column(String(255))
    USED_MEMORY_PEAK = Column(String(255))
    MEMORY_PERC = Column(String(255))
    USED_CPU_SYS = Column(String(255))
    USED_CPU_USER = Column(String(255))
    CONNECTED_CLIENTS = Column(String(255))
    BLOCKED_CLIENTS = Column(String(255))
    CMDSTAT_PING = Column(String(255))
    CMDSTAT_GET = Column(String(255))
    CMDSTAT_SET = Column(String(255))
    KEYSPACE_HITS = Column(String(255))
    KEYSPACE_MISSES = Column(String(255))
    KEYSPACE_HITS_PERC = Column(String(255))
    TOTAL_NET_INPUT_BYTES = Column(String(255))
    TOTAL_NET_OUTPUT_BYTES = Column(String(255))
    DATA_JSON = Column(Text)

class REDISTEST(BaseModel):
    # 表的名字:
    __tablename__ = 'REDIS_TEST'

    # 表的结构:
    ID = Column(Integer, primary_key=True, nullable=False)
    TASK_ID = Column(String(255), nullable=False)
    TEST_TYPE = Column(String(255), nullable=False)
    SET = Column(Float, default=0.0)
    GET = Column(Float, default=0.0)
    INCR = Column(Float, default=0.0)
    LPUSH = Column(Float, default=0.0)
    RPUSH = Column(Float, default=0.0)
    LPOP = Column(Float, default=0.0)
    RPOP = Column(Float, default=0.0)
    SADD = Column(Float, default=0.0)
    HSET = Column(Float, default=0.0)
    SPOP = Column(Float, default=0.0)
    LRANGE_100 = Column(Float, default=0.0)
    LRANGE_300 = Column(Float, default=0.0)
    LRANGE_500 = Column(Float, default=0.0)
    LRANGE_600 = Column(Float, default=0.0)
    MSET = Column(Float, default=0.0)
    DATA_JSON = Column(Text)
