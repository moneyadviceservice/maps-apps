# CSP Violations Report Generator

A Node.js script to parse Content Security Policy violation logs and generate interactive HTML or Markdown reports.

## Usage

```bash
node parse-csp-violations.js <log-file-path> [options]
```

## Options

- `--format, -f` - Output format: `html`, `markdown` (or `md`), or `both` (default: `html`)
- `--output, -o` - Custom output file path (optional)
- `--help, -h` - Show help message

## Examples

```bash
# Generate HTML report (default)
node parse-csp-violations.js csp-violations.log
open csp-report.html

# Generate Markdown report
node parse-csp-violations.js csp-violations.log --format markdown
open csp-report.md

# Generate both formats
node parse-csp-violations.js csp-violations.log --format both

# Custom output path
node parse-csp-violations.js csp-violations.log -f html -o custom-report.html
```

## Obtaining Logs

To get CSP violation logs from Netlify:

1. Navigate to your site's Functions tab in Netlify dashboard
2. Open the `_csp_violations` function logs
3. Copy the log output
4. Paste into a new file named `csp-violations.log`
