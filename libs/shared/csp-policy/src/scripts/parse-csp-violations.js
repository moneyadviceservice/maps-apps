#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const STYLES = {
  button: {
    base: 'px-4 py-2 rounded-lg text-sm font-medium transition',
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  },
  badge: {
    base: 'px-3 py-1 rounded-md font-mono bg-gray-100 text-gray-700',
    directive: 'text-xs',
    count: 'text-sm py-1.5',
  },
  card: {
    base: 'bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition cursor-pointer',
    uri: 'text-sm text-gray-700 font-mono bg-gray-50 px-3 py-2 rounded border border-gray-200',
  },
  input: {
    search:
      'w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 shadow-sm',
    select:
      'px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-200 transition',
  },
};

function parseCspLog(logFilePath) {
  const content = fs.readFileSync(logFilePath, 'utf-8');
  const lines = content.split('\n');

  const allViolations = [];
  const uniqueViolations = [];
  const seen = new Set();
  const countByBlockedUri = {};

  for (const line of lines) {
    if (!line.trim() || !line.includes('INFO')) continue;

    try {
      const jsonMatch = line.match(/INFO\s+(\{.*\})/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1];
        const violation = JSON.parse(jsonStr);

        allViolations.push(violation);

        const key = violation['blocked-uri'];

        countByBlockedUri[key] = (countByBlockedUri[key] || 0) + 1;

        if (!seen.has(key)) {
          seen.add(key);
          uniqueViolations.push(violation);
        }
      }
    } catch (error) {
      console.error(`Error parsing line: ${error.message}`);
    }
  }

  uniqueViolations.forEach((v) => {
    v.occurrenceCount = countByBlockedUri[v['blocked-uri']] || 1;
  });

  return { allViolations, uniqueViolations };
}

/**
 * Analyze violations and create summary statistics
 * @param {Array} allViolations - All violations before deduplication (for accurate document URI counts)
 * @param {Array} uniqueViolations - Unique violations after deduplication (for directive counts)
 */
function analyzeViolations(allViolations, uniqueViolations) {
  const stats = {
    total: uniqueViolations.length,
    totalAll: allViolations.length,
    byDirective: {},
    byDocumentUri: {},
  };

  // Count directives from unique violations
  uniqueViolations.forEach((v) => {
    const directive =
      v['violated-directive'] || v['effective-directive'] || 'unknown';
    stats.byDirective[directive] = (stats.byDirective[directive] || 0) + 1;
  });

  // Count document URIs from all violations (before deduplication)
  allViolations.forEach((v) => {
    const docUri = v['document-uri'] || 'unknown';
    const baseDocUri = docUri.split('?')[0];
    stats.byDocumentUri[baseDocUri] =
      (stats.byDocumentUri[baseDocUri] || 0) + 1;
  });

  return stats;
}

/**
 * Generate Markdown report
 */
function generateMarkdownReport(violations, stats) {
  const sortedDirectives = Object.entries(stats.byDirective).sort(
    (a, b) => b[1] - a[1],
  );

  const sortedDocumentUris = Object.entries(stats.byDocumentUri)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20); // Top 20

  let siteName = 'Unknown Site';
  if (sortedDocumentUris.length > 0) {
    try {
      const url = new URL(sortedDocumentUris[0][0]);
      siteName = url.hostname;
    } catch (e) {
      siteName = sortedDocumentUris[0][0];
    }
  }

  let markdown = `# CSP Violations Report for ${siteName}

**Generated:** ${new Date().toLocaleString()}

**Summary:** ${stats.total} unique violations (${
    stats.totalAll
  } total occurrences)

---

## Violations by Directive

| Directive | Count | Percentage |
|-----------|-------|------------|
`;

  sortedDirectives.forEach(([directive, count]) => {
    const percentage = ((count / stats.total) * 100).toFixed(1);
    markdown += `| \`${directive}\` | ${count} | ${percentage}% |\n`;
  });

  markdown += `\n---\n\n## Top Affected Pages

| Document URI | Count | Percentage |
|--------------|-------|------------|
`;

  sortedDocumentUris.forEach(([uri, count]) => {
    const percentage = ((count / stats.totalAll) * 100).toFixed(2);
    markdown += `| \`${uri}\` | ${count} | ${percentage}% |\n`;
  });

  markdown += `\n---\n\n## All Violations\n\n`;

  // Group by directive for easier reading
  const violationsByDirective = {};
  violations.forEach((v) => {
    const directive =
      v['violated-directive'] || v['effective-directive'] || 'unknown';
    if (!violationsByDirective[directive]) {
      violationsByDirective[directive] = [];
    }
    violationsByDirective[directive].push(v);
  });

  Object.entries(violationsByDirective)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([directive, dirViolations]) => {
      markdown += `### ${directive} (${dirViolations.length} unique)\n\n`;

      dirViolations
        .sort((a, b) => (b.occurrenceCount || 1) - (a.occurrenceCount || 1))
        .forEach((v) => {
          const blockedUri = v['blocked-uri'] || 'N/A';
          const count = v.occurrenceCount || 1;

          markdown += `#### Blocked URI (${count}x)\n\n`;
          markdown += `\`\`\`\n${blockedUri}\n\`\`\`\n\n`;
          markdown += `<details>\n<summary>View full violation details</summary>\n\n`;
          markdown += `\`\`\`json\n${JSON.stringify(v, null, 2)}\n\`\`\`\n\n`;
          markdown += `</details>\n\n`;
        });
    });

  return markdown;
}

/**
 * Generate HTML report
 */
function generateHtmlReport(violations, stats) {
  const sortedDirectives = Object.entries(stats.byDirective).sort(
    (a, b) => b[1] - a[1],
  );

  const sortedDocumentUris = Object.entries(stats.byDocumentUri)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20); // Top 20

  // Extract site name from most common document URI
  let siteName = 'Unknown Site';
  if (sortedDocumentUris.length > 0) {
    try {
      const url = new URL(sortedDocumentUris[0][0]);
      siteName = url.hostname;
    } catch (e) {
      // If URL parsing fails, use as-is
      siteName = sortedDocumentUris[0][0];
    }
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSP Violations Report for ${siteName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .bar-fill {
      transition: width 0.3s ease;
    }
  </style>
</head>
<body class="bg-gray-50 p-5">
  <div class="max-w-7xl mx-auto bg-white p-10 rounded-lg shadow-lg border border-gray-200">
    <h1 class="text-3xl font-semibold text-gray-900 mb-2">CSP Violations Report for ${escapeHtml(
      siteName,
    )}</h1>
    <p class="text-sm text-gray-600 mb-8">Generated: ${new Date().toLocaleString()}</p>

    <h2 class="text-2xl font-semibold text-gray-900 mt-10 mb-5 pb-2 border-b border-gray-300">Violations by Directive</h2>
    <div class="space-y-3 my-5">
      ${sortedDirectives
        .map(([directive, count]) =>
          createProgressBar(directive, count, stats.total),
        )
        .join('')}
    </div>

    <h2 class="text-2xl font-semibold text-gray-900 mt-10 mb-5 pb-2 border-b border-gray-300">Top Affected Pages</h2>
    <div class="overflow-x-auto my-5">
      <table class="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead>
          <tr class="bg-gray-100">
            <th class="text-left p-3 font-semibold text-sm text-gray-900 border-b border-gray-200">Document URI</th>
            <th class="text-right p-3 font-semibold text-sm text-gray-900 border-b border-gray-200">Count</th>
            <th class="text-right p-3 font-semibold text-sm text-gray-900 border-b border-gray-200">Percentage</th>
          </tr>
        </thead>
        <tbody>
          ${sortedDocumentUris
            .map(([uri, count]) =>
              createTableRow(
                uri,
                count,
                ((count / stats.totalAll) * 100).toFixed(2),
              ),
            )
            .join('')}
        </tbody>
      </table>
    </div>

    <h2 class="text-2xl font-semibold text-gray-900 mt-10 mb-5 pb-2 border-b border-gray-300">All Violations</h2>
    <input type="text" id="searchBox" class="${
      STYLES.input.search
    } my-5" placeholder="Search violations by URI, directive, or any text...">

    <div class="flex flex-wrap gap-2 my-5 items-center">
      ${createButton('All', 'primary', 'all', 'all')}
      ${sortedDirectives
        .slice(0, 5)
        .map(([directive]) =>
          createButton(directive, 'secondary', 'directive', directive),
        )
        .join('')}
      <div id="sortContainer" class="ml-auto flex items-center gap-2">
        <label class="text-sm text-gray-700 font-medium">Sort:</label>
        <select id="sortOrder" class="${
          STYLES.input.select
        }" onchange="handleSortChange()">
          <option value="count-desc">Count (High to Low)</option>
          <option value="count-asc">Count (Low to High)</option>
          <option value="default">Default</option>
        </select>
      </div>
    </div>

    <div class="mb-4 text-sm text-gray-600">
      Showing <span id="visibleCount">0</span> of <span id="totalCount">${
        violations.length
      }</span> violations
    </div>

    <div id="violationsList" class="space-y-3">
      ${violations
        .reverse()
        .map((v, index) => createViolationCard(v, index))
        .join('')}
    </div>

    <div id="pagination" class="flex justify-center items-center gap-2 mt-6">
      <button id="prevPage" class="${STYLES.button.base} ${
    STYLES.button.secondary
  } disabled:opacity-50 disabled:cursor-not-allowed" disabled>Previous</button>
      <span id="pageInfo" class="text-sm text-gray-700 px-4 font-medium"></span>
      <button id="nextPage" class="${STYLES.button.base} ${
    STYLES.button.secondary
  } disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
    </div>
  </div>

  <script>
    // State management
    const state = {
      filterType: 'all',
      filterValue: 'all',
      currentPage: 1,
      sortOrder: 'count-desc',
      allElements: [],
      itemsPerPage: 20
    };

    // Constants
    const BUTTON_CLASSES = {
      active: ['bg-blue-500', 'text-white'],
      inactive: ['bg-gray-100', 'text-gray-700']
    };

    // Initialize immediately when script runs
    setTimeout(() => {
      const violationsList = document.getElementById('violationsList');
      if (violationsList && state.allElements.length === 0) {
        state.allElements = Array.from(violationsList.children).map(el => el.cloneNode(true));
        // Initial display
        applyFilters();
      }
    }, 0);

    // Copy to clipboard with visual feedback
    window.copyToClipboard = async function(text, button) {
      try {
        await navigator.clipboard.writeText(text);
        updateButtonState(button, 'Copied!', ['bg-green-600'], ['bg-blue-600', 'hover:bg-blue-700'], 2000);
      } catch (err) {
        updateButtonState(button, 'Failed to copy', [], [], 2000, 'Copy Blocked URI');
      }
    };

    // Copy JSON content from pre element
    window.copyJsonContent = async function(preId, button) {
      try {
        const preElement = document.getElementById(preId);
        const jsonText = preElement.textContent;
        await navigator.clipboard.writeText(jsonText);
        updateButtonState(button, 'Copied!', ['bg-green-600'], ['bg-blue-600', 'hover:bg-blue-700'], 2000, 'Copy JSON');
      } catch (err) {
        updateButtonState(button, 'Failed to copy', [], [], 2000, 'Copy JSON');
      }
    };

    // Helper function to update button state temporarily
    function updateButtonState(button, tempText, addClasses, removeClasses, duration, finalText) {
      const originalText = finalText || button.textContent;
      button.textContent = tempText;
      removeClasses.forEach(c => button.classList.remove(c));
      addClasses.forEach(c => button.classList.add(c));

      setTimeout(() => {
        button.textContent = originalText;
        addClasses.forEach(c => button.classList.remove(c));
        removeClasses.forEach(c => button.classList.add(c));
      }, duration);
    }

    // Handle sort change
    window.handleSortChange = function() {
      state.sortOrder = document.getElementById('sortOrder').value;
      state.currentPage = 1;
      applyFilters();
    };

    // Apply filters, search, sort, and pagination
    function applyFilters() {
      const searchTerm = document.getElementById('searchBox').value.toLowerCase();
      const violationsList = document.getElementById('violationsList');

      // Ensure elements are stored - clone them to preserve originals
      if (state.allElements.length === 0 && violationsList) {
        state.allElements = Array.from(violationsList.children).map(el => el.cloneNode(true));
      }

      // Filter violations based on search and filter criteria
      let filtered = filterViolationElements(state.allElements, searchTerm);

      // Sort if on "All" filter
      if (state.filterType === 'all' && state.sortOrder !== 'default') {
        filtered = sortViolations(filtered);
      }

      // Update UI with filtered and paginated results
      updateViolationsList(violationsList, filtered);
      updateUICounters(filtered.length);
      updateSortDropdown();
    }

    // Filter violations based on search and filter settings
    function filterViolationElements(violations, searchTerm) {
      return violations.filter(violation => {
        const text = violation.textContent.toLowerCase();
        const directive = violation.getAttribute('data-directive');
        const matchesSearch = !searchTerm || text.includes(searchTerm);
        const matchesFilter = state.filterType === 'all' || directive === state.filterValue;
        return matchesSearch && matchesFilter;
      });
    }

    // Sort violations by count (creates a new sorted array)
    function sortViolations(violations) {
      return [...violations].sort((a, b) => {
        const countA = parseInt(a.getAttribute('data-count')) || 0;
        const countB = parseInt(b.getAttribute('data-count')) || 0;
        return state.sortOrder === 'count-desc' ? countB - countA :
               state.sortOrder === 'count-asc' ? countA - countB : 0;
      });
    }

    // Update violations list with pagination
    function updateViolationsList(container, violations) {
      const totalPages = Math.ceil(violations.length / state.itemsPerPage);
      const startIndex = (state.currentPage - 1) * state.itemsPerPage;
      const endIndex = startIndex + state.itemsPerPage;

      // Clear container
      container.innerHTML = '';

      // Add filtered violations in their sorted order
      violations.forEach((v, index) => {
        if (index >= startIndex && index < endIndex) {
          v.style.display = 'block';
          container.appendChild(v);
        }
      });

      updatePagination(violations.length, totalPages);
    }

    // Update UI counters
    function updateUICounters(count) {
      document.getElementById('visibleCount').textContent = count;
    }

    // Update sort dropdown state
    function updateSortDropdown() {
      const sortContainer = document.getElementById('sortContainer');
      const isAllFilter = state.filterType === 'all';
      sortContainer.style.display = isAllFilter ? 'flex' : 'none';
      if (!isAllFilter) {
        document.getElementById('sortOrder').value = 'count-desc';
        state.sortOrder = 'count-desc';
      }
    }

    // Update pagination controls
    function updatePagination(totalFiltered, totalPages) {
      const prevBtn = document.getElementById('prevPage');
      const nextBtn = document.getElementById('nextPage');
      const pageInfo = document.getElementById('pageInfo');

      prevBtn.disabled = state.currentPage === 1;
      nextBtn.disabled = state.currentPage >= totalPages || totalFiltered === 0;
      pageInfo.textContent = totalFiltered === 0 ? 'No results' : \`Page \${state.currentPage} of \${totalPages}\`;
    }

    // Navigate pages
    function navigatePage(delta) {
      state.currentPage += delta;
      applyFilters();
      document.getElementById('violationsList').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Update filter button states
    function updateFilterButtons(filterType, filterValue) {
      document.querySelectorAll('[data-filter-type]').forEach(btn => {
        const btnType = btn.getAttribute('data-filter-type');
        const isActive = (filterType === 'all' && btnType === 'all') ||
                        (filterType === 'directive' && btnType === 'directive' && btn.textContent === filterValue);

        if (isActive) {
          BUTTON_CLASSES.active.forEach(c => btn.classList.add(c));
          BUTTON_CLASSES.inactive.forEach(c => btn.classList.remove(c));
        } else {
          BUTTON_CLASSES.active.forEach(c => btn.classList.remove(c));
          BUTTON_CLASSES.inactive.forEach(c => btn.classList.add(c));
        }
      });
    }

    // Set up event listeners
    document.getElementById('prevPage').addEventListener('click', () => {
      if (state.currentPage > 1) navigatePage(-1);
    });

    document.getElementById('nextPage').addEventListener('click', () => navigatePage(1));

    document.getElementById('searchBox').addEventListener('input', () => {
      state.currentPage = 1;
      applyFilters();
    });

    // Filter functionality
    window.filterViolations = function(filterType, filterValue) {
      state.filterType = filterType;
      state.filterValue = filterValue;
      state.currentPage = 1;
      updateFilterButtons(filterType, filterValue);
      applyFilters();
    };

    // Show violations by document URI
    window.showViolationsByDocUri = function(uri) {
      // Ensure we have all elements before filtering
      const violationsList = document.getElementById('violationsList');
      if (state.allElements.length === 0 && violationsList) {
        state.allElements = Array.from(violationsList.children).map(el => el.cloneNode(true));
      }

      document.getElementById('violationsList').scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById('searchBox').value = uri;
      state.filterType = 'all';
      state.filterValue = 'all';
      state.currentPage = 1;
      updateFilterButtons('all', 'all');
      applyFilters();
    };
  </script>
</body>
</html>`;

  return html;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Generate a button element
 */
function createButton(text, type, filterType, filterValue = null) {
  const baseClass = STYLES.button.base;
  const typeClass =
    type === 'primary' ? STYLES.button.primary : STYLES.button.secondary;
  const dataAttr = filterType ? `data-filter-type="${filterType}"` : '';
  const actualFilterValue =
    filterValue !== null ? filterValue.replace(/'/g, "\\'") : '';
  const onClick =
    filterValue !== null
      ? `onclick="filterViolations('${filterType}', '${actualFilterValue}')"`
      : '';

  return `<button class="${baseClass} ${typeClass}" ${dataAttr} ${onClick}>${text}</button>`;
}

/**
 * Generate a badge element
 */
function createBadge(text, type = 'directive') {
  const baseClass = STYLES.badge.base;
  const typeClass =
    type === 'directive' ? STYLES.badge.directive : STYLES.badge.count;
  return `<span class="${baseClass} ${typeClass}">${escapeHtml(text)}</span>`;
}

/**
 * Generate progress bar for directive stats
 */
function createProgressBar(label, count, total) {
  const percentage = (count / total) * 100;
  return `
    <div class="flex items-center gap-3">
      <div class="min-w-[150px] text-sm text-gray-700 font-medium">${label}</div>
      <div class="flex-1 bg-gray-200 rounded h-6 relative">
        <div class="bar-fill bg-blue-600 h-full rounded flex items-center px-2 text-white font-medium text-xs" style="width: ${percentage}%">
          ${percentage.toFixed(1)}%
        </div>
      </div>
      <div class="min-w-[60px] text-right font-semibold text-sm text-gray-900">${count.toLocaleString()}</div>
    </div>
  `;
}

/**
 * Generate table row for document URIs
 */
function createTableRow(uri, count, percentage) {
  const escapedUri = escapeHtml(uri);
  return `
    <tr class="hover:bg-gray-50">
      <td class="p-3 border-b border-gray-100 text-sm text-blue-600 break-all cursor-pointer hover:underline"
          onclick="showViolationsByDocUri('${escapedUri.replace(
            /'/g,
            "\\'",
          )}')">${escapedUri}</td>
      <td class="p-3 border-b border-gray-100 text-right text-sm text-gray-900">${count.toLocaleString()}</td>
      <td class="p-3 border-b border-gray-100 text-right text-sm text-gray-900">${percentage}%</td>
    </tr>
  `;
}

/**
 * Generate violation card element
 */
function createViolationCard(violation, index) {
  const detailsId = `details-${index}`;
  const blockedUri = violation['blocked-uri'] || 'N/A';
  const truncatedUri =
    blockedUri.length > 120 ? blockedUri.substring(0, 120) + '...' : blockedUri;
  const directive =
    violation['violated-directive'] ||
    violation['effective-directive'] ||
    'unknown';
  const jsonString = JSON.stringify(violation, null, 2);

  return `
    <div class="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition"
         data-directive="${escapeHtml(directive)}"
         data-count="${violation.occurrenceCount || 1}">
      <div class="flex justify-between items-start gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-3">
            ${createBadge(directive, 'directive')}
          </div>
          <div class="${STYLES.card.uri}" title="${escapeHtml(
    blockedUri,
  )}">${escapeHtml(truncatedUri)}</div>
        </div>
        <div class="${STYLES.badge.base} ${STYLES.badge.count}">
          <span>${violation.occurrenceCount || 1}</span>
        </div>
      </div>
      <details class="mt-3" id="${detailsId}">
        <summary class="cursor-pointer text-sm text-gray-600 hover:text-gray-900 font-medium">Show details</summary>
        <div class="mt-3 space-y-3">
          <pre id="json-${index}" class="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto border border-gray-200 text-gray-800">${escapeHtml(
    jsonString,
  )}</pre>
          <div class="flex gap-2">
            <button onclick="event.stopPropagation(); copyToClipboard('${escapeHtml(
              blockedUri,
            ).replace(/'/g, "\\'")}', this)"
                    class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition shadow-sm">
              Copy Blocked URI
            </button>
            <button onclick="event.stopPropagation(); copyJsonContent('json-${index}', this)"
                    class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition shadow-sm">
              Copy JSON
            </button>
          </div>
        </div>
      </details>
    </div>
  `;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
CSP Violations Log Parser

Usage: node parse-csp-violations.js <log-file-path> [options]

Arguments:
  log-file-path      Path to the CSP violations log file (required)

Options:
  --format, -f       Output format: html, markdown, or both (default: html)
  --output, -o       Output file path (optional, default: csp-report.html or csp-report.md)
  --help, -h         Show this help message

Examples:
  node parse-csp-violations.js csp-violations.log
  node parse-csp-violations.js csp-violations.log --format markdown
  node parse-csp-violations.js csp-violations.log --format both
  node parse-csp-violations.js csp-violations.log -f html -o report.html
    `);
    process.exit(0);
  }

  // Parse arguments
  const logFilePath = args[0];
  let format = 'html';
  let outputPath = null;

  for (let i = 1; i < args.length; i++) {
    if ((args[i] === '--format' || args[i] === '-f') && args[i + 1]) {
      format = args[i + 1].toLowerCase();
      i++;
    } else if ((args[i] === '--output' || args[i] === '-o') && args[i + 1]) {
      outputPath = args[i + 1];
      i++;
    }
  }

  // Validate format
  if (!['html', 'markdown', 'md', 'both'].includes(format)) {
    console.error(
      `Error: Invalid format '${format}'. Use: html, markdown, or both`,
    );
    process.exit(1);
  }

  // Normalize format
  if (format === 'md') format = 'markdown';

  if (!fs.existsSync(logFilePath)) {
    console.error(`Error: Log file not found: ${logFilePath}`);
    process.exit(1);
  }

  console.log('Parsing CSP violations log...');
  const { allViolations, uniqueViolations } = parseCspLog(logFilePath);

  console.log(
    `Found ${uniqueViolations.length} unique violations (${allViolations.length} total)`,
  );

  console.log('Analyzing violations...');
  const stats = analyzeViolations(allViolations, uniqueViolations);

  const outputs = [];

  // Generate HTML report
  if (format === 'html' || format === 'both') {
    console.log('Generating HTML report...');
    const html = generateHtmlReport(uniqueViolations, stats);
    const htmlPath = outputPath || 'csp-report.html';
    fs.writeFileSync(htmlPath, html, 'utf-8');
    outputs.push({ type: 'HTML', path: htmlPath, openCmd: `open ${htmlPath}` });
  }

  // Generate Markdown report
  if (format === 'markdown' || format === 'both') {
    console.log('Generating Markdown report...');
    const markdown = generateMarkdownReport(uniqueViolations, stats);
    const mdPath =
      outputPath || (format === 'both' ? 'csp-report.md' : 'csp-report.md');
    fs.writeFileSync(mdPath, markdown, 'utf-8');
    outputs.push({ type: 'Markdown', path: mdPath, openCmd: `open ${mdPath}` });
  }

  console.log(
    `\n✅ Report${outputs.length > 1 ? 's' : ''} generated successfully!`,
  );
  console.log(`   Total violations: ${stats.total.toLocaleString()}`);
  outputs.forEach((output) => {
    console.log(`\n${output.type} Report:`);
    console.log(`   File: ${path.resolve(output.path)}`);
    console.log(`   Open: ${output.openCmd}`);
  });
}

if (require.main === module) {
  main();
}

module.exports = {
  parseCspLog,
  analyzeViolations,
  generateHtmlReport,
  generateMarkdownReport,
};
