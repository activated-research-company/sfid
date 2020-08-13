#!/bin/bash
/usr/src/grafana/api.sh &
exec grafana-server -homepath /usr/share/grafana