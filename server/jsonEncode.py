from datetime import datetime
from datetime import date
import json


# 覆盖json的默认转换行为
class JsonEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%dT%H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime('%Y-%m-%d')
        elif isinstance(obj, bytes):
            return obj.decode()
        else:
            return json.JSONEncoder.default(self, obj)