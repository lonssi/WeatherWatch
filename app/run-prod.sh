#!/bin/bash
set -x
set -e

cd /app
npm install
npm run build-css
npm run build
serve -l 5000 -s build
