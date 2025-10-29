#!/usr/bin/env bash
set -eu 

# Convert template parameter to Bash variable
COMPARE_WITH_TARGET="${COMPARE_WITH_TARGET_ENV,,}"  # lowercase
echo "runAll= '$RUN_ALL'"

if [ "$COMPARE_WITH_TARGET" = "true" ] || [ "$RUN_ALL" = "true" ]; then
    npx nx run-many -t typecheck
else
    npx nx affected --target=typecheck --base=HEAD~1 --head=HEAD
fi