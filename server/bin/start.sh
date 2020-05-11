#!/bin/bash

SHELL_PATH=$(dirname $0)
python3 $SHELL_PATH/../web_server.py >> $SHELL_PATH/../../log/web_server.log 2>&1 &
