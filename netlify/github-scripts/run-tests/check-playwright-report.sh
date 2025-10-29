#!/usr/bin/env bash
set -eu 

REPORT_DIR="apps/e2e/${PROJECT_NAME}-e2e/playwright-report"

if [ -d "$REPORT_DIR" ]; then
    echo "Playwright report found for ${PROJECT_NAME}."
else
    echo "No Playwright report found for ${PROJECT_NAME}, skipping upload."
    exit 0
fi