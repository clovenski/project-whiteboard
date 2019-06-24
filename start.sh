#!/usr/bin/env bash

# run the app through npm start script

PROJ_DIR=$(dirname "$0")
if [ "$PROJ_DIR" != "$(pwd)" ]; then
  cd $PROJ_DIR
fi
npm start -- "$@" # pass --debug to open dev tools for debugging
