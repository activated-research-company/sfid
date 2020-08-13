#!/bin/bash

mount -t ext4 -o rw -L influxdb /var/lib/influxdb

influxd