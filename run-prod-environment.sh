#!/bin/bash
set -x
set -e

docker build -t weatherwatch .

git submodule init && git submodule update

# Cleanup old compose (if exists)
docker-compose --file docker-compose-production.yml down || true

docker-compose --file docker-compose-production.yml up
