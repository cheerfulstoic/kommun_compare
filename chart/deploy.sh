#!/usr/bin/env sh

# abort on errors
set -e

npx yarn run build

git add dist

git commit -m 'deploy'

git push
