#!/usr/bin/env sh

# abort on errors
set -e

yarn run build

git add dist

git commit -m 'deploy'

git push
