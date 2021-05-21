#!/bin/bash

# create symlink from playground/static/dist to root project's dist
site_dist=static/dist
root_proj_dist=../../dist

if [ ! -L  ${site_dist} ]; then
    ln -s $root_proj_dist $site_dist
fi

python index.py --delay=0