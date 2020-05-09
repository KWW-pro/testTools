#!/bin/bash -x 
SHELL_PATH=$(dirname $0)
PORT=8080
rtn=$(netstat -tlnp| grep $PORT | wc -l)
if [ "$rtn" == 0 ];then
    exit -1
else
    exit 0
fi
