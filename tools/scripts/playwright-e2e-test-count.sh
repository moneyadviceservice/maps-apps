#!/usr/bin/env bash

set -uo pipefail

BASE_DIR="apps/e2e"

for dir in "$BASE_DIR"/*/; do
  project="$(basename "$dir")"
  config="$dir/playwright.config.ts"

  if [[ -f "$config" ]]; then
    count=$(
    npx playwright test --config="$config" --list </dev/null 2>/dev/null \
        | grep -E '^[[:space:]]+[^[:space:]].*\.spec\.' \
        | wc -l
    )

    count=${count:-0}
    trimmed_count=$(echo "$count" | xargs)
    printf "%-40s - %s tests\n" "$project" "$trimmed_count"
  fi
done