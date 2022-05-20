#!/usr/bin/env sh

set -e

browserify scripts/s4tk-api.cjs -o temp/s4tk-api.js

minify temp/s4tk-api.js > public/node/s4tk-api.min.js
