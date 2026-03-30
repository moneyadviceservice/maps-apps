#!/bin/bash
# Example script to generate a markdown summary from Grype JSON results
# Can be integrated into the pipeline and published as a build summary

RESULTS_FILE="vulnerability-reports/grype-results.json"

if [ ! -f "$RESULTS_FILE" ]; then
    echo "No results file found"
    exit 0
fi

# Count vulnerabilities by severity
CRITICAL=$(jq '[.matches[] | select(.vulnerability.severity == "Critical")] | length' "$RESULTS_FILE")
HIGH=$(jq '[.matches[] | select(.vulnerability.severity == "High")] | length' "$RESULTS_FILE")
MEDIUM=$(jq '[.matches[] | select(.vulnerability.severity == "Medium")] | length' "$RESULTS_FILE")
LOW=$(jq '[.matches[] | select(.vulnerability.severity == "Low")] | length' "$RESULTS_FILE")
TOTAL=$(jq '.matches | length' "$RESULTS_FILE")

# Generate markdown summary
cat > vulnerability-summary.md <<EOF
# 🔒 Vulnerability Scan Results

## Summary
- **Total Vulnerabilities**: $TOTAL
- **Critical**: 🔴 $CRITICAL
- **High**: 🟠 $HIGH  
- **Medium**: 🟡 $MEDIUM
- **Low**: 🟢 $LOW

## Details

### Critical & High Severity Issues
EOF

# Add critical and high severity details
jq -r '.matches[] | select(.vulnerability.severity == "Critical" or .vulnerability.severity == "High") | 
"- **\(.artifact.name)** (\(.artifact.version)) - \(.vulnerability.id): \(.vulnerability.description // "No description")"' \
"$RESULTS_FILE" >> vulnerability-summary.md

echo ""
echo "## 📊 Vulnerability Summary Generated"
cat vulnerability-summary.md
