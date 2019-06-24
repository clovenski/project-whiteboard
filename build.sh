#!/usr/bin/env bash

# run the npm build script to package the app

PROJ_DIR=$(dirname "$0")
if [ "$PROJ_DIR" != "$(pwd)" ]; then
  cd $PROJ_DIR
fi
npm run build -- "$@" # pass more --ignore args as needed
# for example, pass --ignore=\\.vscode as arg to this script
# to ignore workspace settings in vscode
