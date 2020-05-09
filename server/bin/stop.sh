#!/bin/bash

SHELL_PATH=$(dirname $0)

SERVER_PID=$(ps aux|grep web_server|grep -v grep|awk '{print $2}')
if [ "$SERVER_PID"x == ""x ];then
    ;
else
    kill -9 $SERVER_PID
fi
