#!/usr/bin/env bash
set -eu 

echo "E2E_FAILED value is: $E2E_FAILED"

if [ "$E2E_FAILED" = "true" ]; then
    echo "E2E tests failed. Failing pipeline."
    exit 1
else
    echo "E2E tests passed successfully."
fi