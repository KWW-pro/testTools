#coding=utf-8
import os
import sys
from sqlalchemy.orm import scoped_session
from sqlalchemy import Column, String, create_engine, Integer, TIMESTAMP, Float, LargeBinary, func, ForeignKey, DATE, Text, CLOB
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.engine.url import URL
import json
import threading
from db_tables import *
import configparser

cf = configparser.ConfigParser()
cf.read("../etc/pythonToDb.conf")

MySqlHost = cf.get("mysql", "mysqlHost")
MySqlPort = cf.get("mysql", "mysqlPort")
MySqlUserName = cf.get("mysql", "mysqlUser")
MySqlPassWord = cf.get("mysql", "mysqlPassword")

class testTools:
    def __init__(self):
        url = URL(drivername='mysql+pymysql', username=MySqlUserName, password=MySqlPassWord, host=MySqlHost,
                  port=MySqlPort, database='test_tools', query={})
        print(url)
        db_engine = create_engine(url, pool_size=110, echo=False, encoding='utf8', pool_recycle=1800)
        session_factory = sessionmaker(bind=db_engine,autocommit=True)
        self.Session = scoped_session(session_factory)

    def GetSession(self):
        session = self.Session()
        return session

    def addTask(self,params):
        try:
            # 参数检查
            if 'TaskID' not in params:
                return {'result': -1, 'desc': '缺少参数TaskID'}
            # if 'Service' not in params:
            #     return {'result': -1, 'desc': '缺少参数Service'}
            if 'Host' not in params:
                return {'result': -1, 'desc': '缺少参数Host'}
            if 'Port' not in params:
                return {'result': -1, 'desc': '缺少参数Port'}
            if 'Type' not in params:
                return {'result': -1, 'desc': '缺少参数Type'}
            if params['CommondList'] == "":
                params['CommondList'] = '""'
            if params['RedisServerPassword'] == "":
                params['RedisServerPassword'] = '""'

            print("params",params)
            startThreading_thread = threading.Thread(target=self.startThreading, args=(params, ))
            startThreading_thread.start()
            return {'result': 0, 'desc': 'success'}
        except Exception as e:
            return {'result': -1, 'desc': e}
    def startThreading(self, params):
        try:
            if params['Type'] == 1:
                thread1 = threading.Thread(target=self.redisInfo, args=(params,))
                thread1.start()
                thread2 = threading.Thread(target=self.redisBenchmark, args=(params,))
                thread2.start()
                thread2.join()
                thread3 = threading.Thread(target=self.reidHi, args=(params,))
                thread3.start()
                thread3.join()
                self.redisInfoQuit(params)
            elif params['Type'] == -999:
                thread1 = threading.Thread(target=self.redisInfo, args=(params,))
                thread1.start()
                thread2 = threading.Thread(target=self.redisBenchmark, args=(params,))
                thread2.start()
                thread2.join()
                self.redisInfoQuit(params)
            elif params['Type'] == 0:
                thread1 = threading.Thread(target=self.redisInfo, args=(params,))
                thread1.start()
                thread2 = threading.Thread(target=self.reidHi, args=(params,))
                thread2.start()
                thread2.join()
                self.redisInfoQuit(params)
        except Exception as e:
            print(e)
            
    def redisInfo(self, params):
        try:
            os.system('../bin/redisInfo -H %s -P %s -T %s -F %s -A "%s"' % (params['Host'], params['Port'], params['TimeOut'], params['TaskID'], params['RedisServerPassword']))
        except Exception as e:
            print(e)

    def redisBenchmark(self, params):
        try:
            os.system('../bin/redisBenchmark -H %s -P %s -T "%s" -C %s -S %s -F %s -N %s -A "%s"'
                      % (params['Host'], params['Port'], params['CommondList'], params['ConnectCount'], params['ValueSize'],
                         params['TaskID'], params['CommondCount'], params['RedisServerPassword']))
            print('../bin/redisBenchmark -H %s -P %s -T "%s" -C %s -S %s -F %s -N %s -A %s' % (params['Host'], params['Port'], params['CommondList'], params['ConnectCount'], params['ValueSize'], params['TaskID'], params['CommondCount'], params['RedisServerPassword']))
        except Exception as e:
            print(e)

    def reidHi(self, params):
        try:
            os.system('../bin/redisHi -H %s -P %s -T %s -C %s -S %s -F %s -N %s -A %s'
                      % (params['Host'], params['Port'], params['CommondList'], params['ConnectCount'], params['ValueSize'],
                         params['TaskID'], params['CommondCount'], params['RedisServerPassword']))
            print('../bin/redisHi -H %s -P %s -T %s -C %s -S %s -F %s -N %s -A %s' % (params['Host'], params['Port'], params['CommondList'], params['ConnectCount'], params['ValueSize'], params['TaskID'], params['CommondCount'], params['RedisServerPassword']))

        except Exception as e:
            print(e)
    
    def redisInfoQuit(self, params):
        try:
            os.system('../bin/redisInfo -Q -F %s' % params['TaskID'])
        except Exception as e:
            print(e)

    def getRedisInfo(self,params):
        try:
            mysession = self.GetSession()
            #参数检查
            if 'TaskID' not in params:
                return {'result': -1, 'desc': '缺少参数TaskID'}
            redisInfo_list = list()
            RedisInfo = mysession.query(REDISINFO).filter(REDISINFO.TASK_ID == params['TaskID'])
            if RedisInfo:
                for i in RedisInfo:
                    redisInfo_dict = dict()
                    redisInfo_dict['ID'] = i.ID
                    redisInfo_dict['TASK_ID'] = i.TASK_ID
                    redisInfo_dict['INFO_DATE'] = i.INFO_DATE
                    redisInfo_dict['USED_MEMORY_RSS'] = i.USED_MEMORY_RSS
                    redisInfo_dict['USED_MEMORY_PEAK'] = i.USED_MEMORY_PEAK
                    redisInfo_dict['MEMORY_PERC'] = i.MEMORY_PERC
                    redisInfo_dict['USED_CPU_SYS'] = i.USED_CPU_SYS
                    redisInfo_dict['USED_CPU_USER'] = i.USED_CPU_USER
                    redisInfo_dict['CONNECTED_CLIENTS'] = i.CONNECTED_CLIENTS
                    redisInfo_dict['BLOCKED_CLIENTS'] = i.BLOCKED_CLIENTS
                    redisInfo_dict['CMDSTAT_PING'] = i.CMDSTAT_PING
                    redisInfo_dict['CMDSTAT_GET'] = i.CMDSTAT_GET
                    redisInfo_dict['CMDSTAT_SET'] = i.CMDSTAT_SET
                    redisInfo_dict['KEYSPACE_HITS'] = i.KEYSPACE_HITS
                    redisInfo_dict['KEYSPACE_MISSES'] = i.KEYSPACE_MISSES
                    redisInfo_dict['KEYSPACE_HITS_PERC'] = i.KEYSPACE_HITS_PERC
                    redisInfo_dict['TOTAL_NET_INPUT_BYTES'] = i.TOTAL_NET_INPUT_BYTES
                    redisInfo_dict['TOTAL_NET_OUTPUT_BYTES'] = i.TOTAL_NET_OUTPUT_BYTES
                    #redisInfo_dict['DATA_JSON'] = i.DATA_JSON
                    redisInfo_list.append(redisInfo_dict)
                return {'result': 0, 'desc': 'success', 'para': redisInfo_list}
            else:
                return {'result': -1, 'desc': '未查询到数据'}
        except Exception as e:
            print(e)
            return {'result': -1, 'desc': e}

    def getRedisTask(self,params):
        try:
            taskInfo_list = list()
            #连接数据库
            mysession = self.GetSession()
            # 参数检查
            if 'TaskID' not in params:
                return {'result': -1, 'desc': '缺少参数TaskID'}
            #查询全部类型的任务数据
            if 'TaskType' not in params:
                TaskInfo = mysession.query(REDISTEST).filter(REDISTEST.TASK_ID == params['TaskID'])
                for i in TaskInfo:
                    taskInfo_dict = dict()
                    if i.TEST_TYPE == 'redisBenchmark':
                        redisBenchmarkInfo_dict = dict()
                        redisBenchmarkInfo_dict['ID'] = i.ID
                        redisBenchmarkInfo_dict['TASK_ID'] = i.TASK_ID
                        redisBenchmarkInfo_dict['TEST_TYPE'] = i.TEST_TYPE
                        redisBenchmarkInfo_dict['SET'] = i.SET
                        redisBenchmarkInfo_dict['GET'] = i.GET
                        redisBenchmarkInfo_dict['INCR'] = i.INCR
                        redisBenchmarkInfo_dict['LPUSH'] = i.LPUSH
                        redisBenchmarkInfo_dict['RPUSH'] = i.RPUSH
                        redisBenchmarkInfo_dict['LPOP'] = i.LPOP
                        redisBenchmarkInfo_dict['RPOP'] = i.RPOP
                        redisBenchmarkInfo_dict['SADD'] = i.SADD
                        redisBenchmarkInfo_dict['HSET'] = i.HSET
                        redisBenchmarkInfo_dict['SPOP'] = i.SPOP
                        redisBenchmarkInfo_dict['LRANGE_100'] = i.LRANGE_100
                        redisBenchmarkInfo_dict['LRANGE_300'] = i.LRANGE_300
                        redisBenchmarkInfo_dict['LRANGE_500'] = i.LRANGE_500
                        redisBenchmarkInfo_dict['LRANGE_600'] = i.LRANGE_600
                        redisBenchmarkInfo_dict['MSET'] = i.MSET
                        redisBenchmarkInfo_dict['DATA_JSON'] = i.DATA_JSON
                        taskInfo_dict['redisBenchmarkInfo_dict'] = redisBenchmarkInfo_dict
                    elif i.TEST_TYPE == 'hiRedis':
                        hiRedisInfo_dict = dict()
                        hiRedisInfo_dict['ID'] = i.ID
                        hiRedisInfo_dict['TASK_ID'] = i.TASK_ID
                        hiRedisInfo_dict['TEST_TYPE'] = i.TEST_TYPE
                        hiRedisInfo_dict['SET'] = i.SET
                        hiRedisInfo_dict['GET'] = i.GET
                        hiRedisInfo_dict['INCR'] = i.INCR
                        hiRedisInfo_dict['LPUSH'] = i.LPUSH
                        hiRedisInfo_dict['RPUSH'] = i.RPUSH
                        hiRedisInfo_dict['LPOP'] = i.LPOP
                        hiRedisInfo_dict['RPOP'] = i.RPOP
                        hiRedisInfo_dict['SADD'] = i.SADD
                        hiRedisInfo_dict['HSET'] = i.HSET
                        hiRedisInfo_dict['SPOP'] = i.SPOP
                        hiRedisInfo_dict['LRANGE_100'] = i.LRANGE_100
                        hiRedisInfo_dict['LRANGE_300'] = i.LRANGE_300
                        hiRedisInfo_dict['LRANGE_500'] = i.LRANGE_500
                        hiRedisInfo_dict['LRANGE_600'] = i.LRANGE_600
                        hiRedisInfo_dict['MSET'] = i.MSET
                        hiRedisInfo_dict['DATA_JSON'] = i.DATA_JSON
                        taskInfo_dict['hiRedisInfo_dict'] = hiRedisInfo_dict
                    taskInfo_list.append(taskInfo_dict)
            #查询指定类型的任务数据
            else:
                TaskInfo = mysession.query(REDISTEST).filter(REDISTEST.TASK_ID == params['TaskID']).filter(REDISTEST.TEST_TYPE == params['TaskType'])
                for i in TaskInfo:
                    taskInfo_dict = dict()
                    taskInfo_dict['ID'] = i.ID
                    taskInfo_dict['TASK_ID'] = i.TASK_ID
                    taskInfo_dict['TEST_TYPE'] = i.TEST_TYPE
                    taskInfo_dict['SET'] = i.SET
                    taskInfo_dict['GET'] = i.GET
                    taskInfo_dict['INCR'] = i.INCR
                    taskInfo_dict['LPUSH'] = i.LPUSH
                    taskInfo_dict['RPUSH'] = i.RPUSH
                    taskInfo_dict['LPOP'] = i.LPOP
                    taskInfo_dict['RPOP'] = i.RPOP
                    taskInfo_dict['SADD'] = i.SADD
                    taskInfo_dict['HSET'] = i.HSET
                    taskInfo_dict['SPOP'] = i.SPOP
                    taskInfo_dict['LRANGE_100'] = i.LRANGE_100
                    taskInfo_dict['LRANGE_300'] = i.LRANGE_300
                    taskInfo_dict['LRANGE_500'] = i.LRANGE_500
                    taskInfo_dict['LRANGE_600'] = i.LRANGE_600
                    taskInfo_dict['MSET'] = i.MSET
                    taskInfo_dict['DATA_JSON'] = i.DATA_JSON
                    taskInfo_list.append(taskInfo_dict)
            return {'result': 0, 'desc': 'success', 'para': taskInfo_list}
        except Exception as e:
            print(e)
            return {'result': -1, 'desc': e}

    def getTestTask(self):
        try:
            testTask_list = list()
            mysession = self.GetSession()

            #查询testTask
            TestTask = mysession.query(TESTTASK)
            if TestTask:
                for i in TestTask:
                    testTask_dict = dict()
                    testTask_dict['TaskID'] = i.TASK_ID
                    testTask_dict['TaskService'] = i.TASK_SERVICE
                    testTask_dict['TaskDate'] = i.TASK_DATE
                    testTask_list.append(testTask_dict)
                print(testTask_list)
                return {'result': 0, 'desc': 'success', 'para': testTask_list}
            else:
                return {'result': -1, 'desc': '未查询到数据'}
        except Exception as e:
            print(e)
            return {'result': -1, 'desc': e}

    def deleteTask(self,params):
        try:
            #连接数据库
            mysession = self.GetSession()

            #参数检查
            if 'TaskID' not in params:
                return {'result': -1, 'desc': 'Missing parameter TaskID'}

            #删除RedisTask数据
            RedisTask = mysession.query(REDISTEST).filter(REDISTEST.TASK_ID == params['TaskID'])
            if RedisTask:
                RedisTask.delete(synchronize_session=False)

            #删除RedisInfo数据
            RedisInfo = mysession.query(REDISINFO).filter(REDISINFO.TASK_ID == params['TaskID'])
            if RedisInfo:
                RedisInfo.delete(synchronize_session=False)

            mysession.commit()

            return {'result': 0, 'desc': 'Task Delete Successfully'}
        except Exception as e:
            return {'result': -1, 'desc': e}


if __name__ == '__main__':
    a = testTools()
    params = {
        'TaskID':'test2',
    }
    a.getTestTask()