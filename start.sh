#!/usr/bin/env bash

PROJ_DIR=$(dirname "$0")
if [ "$PROJ_DIR" != "$(pwd)" ]; then
  cd $PROJ_DIR
fi
npm start
