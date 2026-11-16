#!/bin/bash
# Format Grype vulnerability scan results for Microsoft Teams
# Generates an Adaptive Card payload

set -e

GRYPE_RESULTS="${1:-$(Build.SourcesDirectory)/vulnerability-reports/grype-results.json}"
OUTPUT_FILE="${2:-$(Build.SourcesDirectory)/teams-grype-message.json}"

if [ ! -f "$GRYPE_RESULTS" ]; then
    echo "Error: Grype results file not found: $GRYPE_RESULTS"
    exit 1
fi

echo "Parsing Grype results from: $GRYPE_RESULTS"

# Extract unique vulnerability counts by severity (deduplicated by vulnerability ID)
CRITICAL_COUNT=$(jq '[.matches[] | select(.vulnerability.severity == "Critical") | .vulnerability.id] | unique | length' "$GRYPE_RESULTS")
HIGH_COUNT=$(jq '[.matches[] | select(.vulnerability.severity == "High") | .vulnerability.id] | unique | length' "$GRYPE_RESULTS")
MEDIUM_COUNT=$(jq '[.matches[] | select(.vulnerability.severity == "Medium") | .vulnerability.id] | unique | length' "$GRYPE_RESULTS")
LOW_COUNT=$(jq '[.matches[] | select(.vulnerability.severity == "Low") | .vulnerability.id] | unique | length' "$GRYPE_RESULTS")
NEGLIGIBLE_COUNT=$(jq '[.matches[] | select(.vulnerability.severity == "Negligible") | .vulnerability.id] | unique | length' "$GRYPE_RESULTS")
UNKNOWN_COUNT=$(jq '[.matches[] | select(.vulnerability.severity == "Unknown") | .vulnerability.id] | unique | length' "$GRYPE_RESULTS")

TOTAL_COUNT=$((CRITICAL_COUNT + HIGH_COUNT + MEDIUM_COUNT + LOW_COUNT + NEGLIGIBLE_COUNT + UNKNOWN_COUNT))

# Also get total matches (including duplicates) for reference
TOTAL_MATCHES=$(jq '[.matches[]] | length' "$GRYPE_RESULTS")

# Determine color theme based on severity
if [ "$CRITICAL_COUNT" -gt 0 ]; then
    THEME_COLOR="Attention"
    STATUS_TEXT="⛔ Critical vulnerabilities found"
elif [ "$HIGH_COUNT" -gt 0 ]; then
    THEME_COLOR="Warning"
    STATUS_TEXT="⚠️ High severity vulnerabilities found"
elif [ "$TOTAL_COUNT" -gt 0 ]; then
    THEME_COLOR="Warning"
    STATUS_TEXT="⚠️ Vulnerabilities found"
else
    THEME_COLOR="Good"
    STATUS_TEXT="✅ No vulnerabilities detected"
fi

# Get build information
BUILD_ID="${BUILD_BUILDID:-N/A}"
BUILD_URL="${SYSTEM_TEAMFOUNDATIONCOLLECTIONURI}${SYSTEM_TEAMPROJECT}/_build/results?buildId=${BUILD_ID}&view=results"
REPO_NAME="${BUILD_REPOSITORY_NAME:-maps-apps}"
BRANCH_NAME="${BUILD_SOURCEBRANCHNAME:-main}"
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S UTC")

# Get top 5 critical/high vulnerabilities for summary (grouped by vulnerability ID)
TOP_VULNS=$(jq -r '
  [.matches[] | 
   select(.vulnerability.severity == "Critical" or .vulnerability.severity == "High")] |
  group_by(.vulnerability.id) |
  map({
    id: .[0].vulnerability.id,
    severity: .[0].vulnerability.severity,
    packages: [.[].artifact.name] | unique,
    count: length
  }) |
  sort_by(.severity == "High", .severity == "Medium") |
  .[0:5] |
  map(
    if .count > 1 then
      "• **\(.id)** - \(.count) packages affected (\(.severity))"
    else
      "• **\(.id)** - \(.packages[0]) (\(.severity))"
    end
  ) |
  join("\n")
' "$GRYPE_RESULTS")

# If no critical/high, show medium
if [ -z "$TOP_VULNS" ]; then
    TOP_VULNS=$(jq -r '
      [.matches[] | 
       select(.vulnerability.severity == "Medium")] |
      group_by(.vulnerability.id) |
      map({
        id: .[0].vulnerability.id,
        severity: .[0].vulnerability.severity,
        packages: [.[].artifact.name] | unique,
        count: length
      }) |
      .[0:5] |
      map(
        if .count > 1 then
          "• **\(.id)** - \(.count) packages affected (\(.severity))"
        else
          "• **\(.id)** - \(.packages[0]) (\(.severity))"
        end
      ) |
      join("\n")
    ' "$GRYPE_RESULTS")
fi

# If still empty, indicate no high-risk vulnerabilities
if [ -z "$TOP_VULNS" ]; then
    if [ "$TOTAL_COUNT" -gt 0 ]; then
        TOP_VULNS="Only low/negligible severity vulnerabilities detected"
    else
        TOP_VULNS="No vulnerabilities detected in scan"
    fi
fi

# Create Teams Adaptive Card payload
cat > "$OUTPUT_FILE" <<EOF
{
  "type": "message",
  "attachments": [
    {
      "contentType": "application/vnd.microsoft.card.adaptive",
      "contentUrl": null,
      "content": {
        "\$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.4",
        "body": [
          {
            "type": "TextBlock",
            "text": "🔒 Vulnerability Scan Results",
            "weight": "Bolder",
            "size": "Large"
          },
          {
            "type": "TextBlock",
            "text": "$STATUS_TEXT",
            "weight": "Bolder",
            "size": "Medium",
            "color": "$THEME_COLOR",
            "spacing": "Small"
          },
          {
            "type": "FactSet",
            "facts": [
              {
                "title": "Repository:",
                "value": "$REPO_NAME"
              },
              {
                "title": "Branch:",
                "value": "$BRANCH_NAME"
              },
              {
                "title": "Scan Time:",
                "value": "$TIMESTAMP"
              },
              {
                "title": "Unique Vulnerabilities:",
                "value": "$TOTAL_COUNT"
              },
              {
                "title": "Total Findings:",
                "value": "$TOTAL_MATCHES"
              }
            ],
            "spacing": "Medium"
          },
          {
            "type": "Container",
            "style": "emphasis",
            "items": [
              {
                "type": "ColumnSet",
                "columns": [
                  {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                      {
                        "type": "TextBlock",
                        "text": "⛔ Critical",
                        "weight": "Bolder"
                      },
                      {
                        "type": "TextBlock",
                        "text": "$CRITICAL_COUNT",
                        "size": "Large",
                        "color": "Attention"
                      }
                    ]
                  },
                  {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                      {
                        "type": "TextBlock",
                        "text": "🔴 High",
                        "weight": "Bolder"
                      },
                      {
                        "type": "TextBlock",
                        "text": "$HIGH_COUNT",
                        "size": "Large",
                        "color": "Warning"
                      }
                    ]
                  },
                  {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                      {
                        "type": "TextBlock",
                        "text": "🟡 Medium",
                        "weight": "Bolder"
                      },
                      {
                        "type": "TextBlock",
                        "text": "$MEDIUM_COUNT",
                        "size": "Large"
                      }
                    ]
                  },
                  {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                      {
                        "type": "TextBlock",
                        "text": "🔵 Low",
                        "weight": "Bolder"
                      },
                      {
                        "type": "TextBlock",
                        "text": "$LOW_COUNT",
                        "size": "Large"
                      }
                    ]
                  }
                ]
              }
            ],
            "spacing": "Medium"
          },
          {
            "type": "TextBlock",
            "text": "**Top Vulnerabilities:**",
            "weight": "Bolder",
            "spacing": "Medium"
          },
          {
            "type": "TextBlock",
            "text": "$TOP_VULNS",
            "wrap": true,
            "spacing": "Small"
          }
        ],
        "actions": [
          {
            "type": "Action.OpenUrl",
            "title": "View Full Report",
            "url": "$BUILD_URL&view=sariftools.scans.build-tab"
          }
        ]
      }
    }
  ]
}
EOF

echo "Teams message payload created: $OUTPUT_FILE"
echo "Summary: $TOTAL_COUNT unique vulnerabilities ($CRITICAL_COUNT critical, $HIGH_COUNT high, $MEDIUM_COUNT medium, $LOW_COUNT low)"
echo "Total findings (including duplicates): $TOTAL_MATCHES"
