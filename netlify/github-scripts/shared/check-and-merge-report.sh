#!/usr/bin/env bash
set -eu

if ls coverage/maps-apps/*/*/lcov.info 1> /dev/null 2>&1; then
  echo "Found coverage files. Merging..."
  npm run test:merge:coverage
else
  echo "No coverage files found. Skipping merge."
fi