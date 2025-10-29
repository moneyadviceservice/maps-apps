#!/usr/bin/env bash
set -eu

echo "Raw RUN_ALL_SONAR from script output: '$RUN_ALL_SONAR'"

# Apply default
RUN_ALL_SONAR_SCANS="${RUN_ALL_SONAR:-false}"

echo "After applying default: RUN_ALL_SONAR_SCANS='$RUN_ALL_SONAR_SCANS'"

if [ "$RUN_ALL_SONAR_SCANS" = "true" ]; then
echo "##vso[task.setvariable variable=RUN_ALL]true"
else
echo "##vso[task.setvariable variable=RUN_ALL]false"
fi