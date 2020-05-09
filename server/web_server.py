from bottle import route, run, Bottle
from bottle import request, static_file
from bottle import *
import threading
from db_interface import testTools
import os
from jsonEncode import JsonEncoder
import json

db = testTools()


def allow_cross_domain(fn):
    def _enable_cors(*args, **kwargs):
        #set cross headers
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,OPTIONS'
        allow_headers = 'Referer, Accept, Origin, User-Agent'
        response.headers['Access-Control-Allow-Headers'] = allow_headers
        if request.method != 'OPTIONS':
            # actual request; reply with the actual response
            return fn(*args, **kwargs)
    return _enable_cors

#添加任务接口
# params = {
#     'TaskID':'test',
#     'Service':'',   #服务类型：redis，mysql
#     'Host':'',      #主机ip
#     'Port':''       #主机端口
# }
@route('/addTask', method='POST')
def addTask():
    try:
        params = request.body.read()
        try:
            params = json.loads(params)
        except:
            params = {}

        ret =db.addTask(params)

        if ret['result'] != 0:
            res = {'result': 1, 'desc': ret['desc']}
        else:
            res = {'result': 0, 'desc': 'Task Created Successfully'}

        return json.dumps(res, cls=JsonEncoder)
    except Exception as e:
        print(e)

#查询任务
@route('/getDbInfo', method='POST')
def getDbInfo():
    try:
        params = request.body.read()
        try:
            params = json.loads(params)
        except:
            params = {}

        if 'TaskID' not in params:
            return {'result': 1, 'desc': 'Missing parameter TaskID'}

        ret = db.getRedisInfo(params)

        if ret['result'] != 0:
            res = {'result': 1, 'desc': ret['desc']}
        else:
            res = {'result': 0, 'desc': 'DbInfo Inquire Successfully', 'para': ret['para']}

        return json.dumps(res, cls=JsonEncoder)
    except Exception as e:
        print(e)

@route('/getTaskInfo',method='POST')
# params = {
#     'TaskID': 'test',
#     'TaskType': ''  #参数可选如果不填，默认查询全部类型
# }
def getTaskInfo():
    try:
        params = request.body.read()
        try:
            params = json.loads(params)
        except:
            params = {}

        if 'TaskID' not in params:
            return {'result': 1, 'desc': 'Missing parameter TaskID'}

        ret = db.getRedisTask(params)

        if ret['result'] != 0:
            res = {'result': 1, 'desc': ret['desc']}
        else:
            res = {'result': 0, 'desc': 'TaskInfo Inquire Successfully', 'para': ret['para']}

        return json.dumps(res, cls=JsonEncoder)
    except Exception as e:
        print(e)
#查询全部任务id
@route('/getTestTask', method='POST')
def getTestTask():
    try:
        params = request.body.read()
        try:
            params = json.loads(params)
        except:
            params = {}
        ret = db.getTestTask()

        if ret['result'] != 0:
            res = {'result': 1, 'desc': ret['desc']}
        else:
            res = {'result': 0, 'desc': 'TaskInfo Inquire Successfully', 'para': ret['para']}

        return json.dumps(res, cls=JsonEncoder)
    except Exception as e:
        print(e)


#停止任务
@route('/stopTask',method='POST')
def stopTask():
    try:
        pass
    except Exception as e:
        print(e)

#删除任务
@route('/deleteTsk',method='POST')
def deleteTsk():
    try:
        params = request.body.read()
        try:
            params = json.loads(params)
        except:
            params = {}

        if 'TaskID' not in params:
            return {'result': 1, 'desc': 'Missing parameter TaskID'}

        ret = db.deleteTask(params)

        if ret['result'] != 0:
            res = {'result': 1, 'desc': ret['desc']}
        else:
            res = {'result': 0, 'desc': ret['desc']}

        return json.dumps(res, cls=JsonEncoder)
    except Exception as e:
        print(e)


run(host='', port=8080, debug=False, interval=15, server='wsgiref')