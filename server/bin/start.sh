#!/bin/bash

SHELL_PATH=$(dirname $0)
$SHELL_PATH/stop.sh
python3 $SHELL_PATH/../web_server >> $SHELL_PATH/../../log/web_server.log 2>&1 &
