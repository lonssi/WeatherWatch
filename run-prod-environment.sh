#!/bin/bash
set -x
set -e

export METEOR_LOCAL=$([ $(uname) == "Darwin" ] && echo "~/.meteor-linux" || echo "~/.meteor")

docker build -t weatherwatch .

git submodule init && git submodule update

# Cleanup old compose (if exists)
docker-compose --file docker-compose-production.yml down || true

docker-compose --file docker-compose-production.yml up
