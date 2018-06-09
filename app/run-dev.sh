#!/bin/bash
#set -x
set -e

cd /app
npm install
npm run build-css
npm run start
