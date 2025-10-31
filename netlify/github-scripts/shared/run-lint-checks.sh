#!/usr/bin/env bash
set -eu

# Convert template parameter to Bash variable
COMPARE_WITH_TARGET="${COMPARE_WITH_TARGET,,}"  # lowercase
echo "COMPARE_WITH_TARGET = '$COMPARE_WITH_TARGET'"
echo "runAll= '$RUN_ALL_SONAR'"

if [ "$COMPARE_WITH_TARGET" = "true" ] || [ "$RUN_ALL_SONAR" = "true" ]; then
    npx nx run-many -t lint
else
    npx nx affected:lint --base=HEAD~1 --head=HEAD
fi