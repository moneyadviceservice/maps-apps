#!/usr/bin/env bash
set -eu 

if [ "${COMPARE_WITH_TARGET}" == "true" ]; then
    git fetch origin main:main
    git fetch origin main:refs/remotes/origin/main
else
    git fetch  --depth=2 origin main:main
    git fetch  --depth=2 origin main:refs/remotes/origin/main
fi