import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { logger, workspaceRoot } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import {
  addGetSiteIdEntry,
  addMatchSiteCase,
  addPipelineValue,
  addPrTitleScope,
  addSitesPyEntry,
  addSonarEntries,
  addTestAffectedDependency,
  addTestAffectedJob,
  addVsCodeScope,
  GET_SITE_ID_FILE,
  insertListEntry,
  MATCH_SITE_FILE,
  PIPELINE_APP_LISTS,
  PR_TITLE_SCOPES_FILE,
  registerApp,
  RegistrationAnchorError,
  SITES_PY_FILE,
  SONAR_FILE,
  TEST_AFFECTED_FILE,
  VSCODE_SETTINGS_FILE,
} from './registrations';

jest.spyOn(logger, 'warn').mockImplementation(() => undefined);

const SITE_ID = '0f1e2d3c-4b5a-4968-8776-655443322110';

const count = (content: string, needle: string) =>
  content.split(needle).length - 1;

describe('insertListEntry', () => {
  const spec = {
    start: /^list:$/,
    entry: /^ {2}- (\S+)$/,
    end: /^end$/,
    line: '  - banana',
    key: 'banana',
    sorted: true,
  };

  it('inserts in sorted position', () => {
    expect(
      insertListEntry('list:\n  - apple\n  - cherry\nend', spec, 'f'),
    ).toBe('list:\n  - apple\n  - banana\n  - cherry\nend');
  });

  it('inserts before the end when every entry sorts earlier', () => {
    expect(insertListEntry('list:\n  - apple\nend', spec, 'f')).toBe(
      'list:\n  - apple\n  - banana\nend',
    );
  });

  it('appends before the end when not sorted', () => {
    expect(
      insertListEntry(
        'list:\n  - cherry\nend',
        { ...spec, sorted: false },
        'f',
      ),
    ).toBe('list:\n  - cherry\n  - banana\nend');
  });

  it('returns the content unchanged when the key exists', () => {
    const content = 'list:\n  - banana\nend';
    expect(insertListEntry(content, spec, 'f')).toBe(content);
  });

  it('throws when the start or end anchor is missing', () => {
    expect(() => insertListEntry('nothing', spec, 'f')).toThrow(
      RegistrationAnchorError,
    );
    expect(() => insertListEntry('list:\n  - apple', spec, 'f')).toThrow(
      'f: could not find "^end$"',
    );
  });
});

describe('addPrTitleScope', () => {
  const fixture = [
    'VALID_SCOPES = {',
    '    "Apps": [',
    '        "baby-cost-calculator",',
    '        "fuel-finder",',
    '    ],',
    '    "Shared Libraries": [',
    '        "shared-core",',
    '    ],',
    '}',
  ].join('\n');

  it('adds the scope in alphabetical order', () => {
    const result = addPrTitleScope(fixture, 'example-tool');

    expect(result).toBe(
      fixture.replace(
        '        "fuel-finder",',
        '        "example-tool",\n        "fuel-finder",',
      ),
    );
    expect(addPrTitleScope(result, 'example-tool')).toBe(result);
  });

  it('adds a scope that sorts last before the closing bracket', () => {
    expect(addPrTitleScope(fixture, 'zebra')).toContain(
      '        "fuel-finder",\n        "zebra",\n    ],',
    );
  });
});

describe('addMatchSiteCase', () => {
  const fixture = [
    '      case "${{ parameters.projectName }}" in',
    '        "fuel-finder")',
    '          NETLIFY_SITE_ID="f6cbe253-9083-4d34-bd91-b80632080494"',
    '          NETLIFY_SITE_FILTER="fuel-finder"',
    '          NETLIFY_ENV_FILTER="maps-fuel-finder"',
    '          ;;',
    '        *)',
    '          echo "Error: Unknown project name ${{ parameters.projectName }}"',
    '          exit 1',
    '          ;;',
    '      esac',
  ].join('\n');

  it('adds a case before the default branch', () => {
    const result = addMatchSiteCase(fixture, 'example-tool', SITE_ID);

    expect(result).toBe(
      fixture.replace(
        '        *)',
        [
          '        "example-tool")',
          `          NETLIFY_SITE_ID="${SITE_ID}"`,
          '          NETLIFY_SITE_FILTER="example-tool"',
          '          NETLIFY_ENV_FILTER="example-tool"',
          '          ;;',
          '        *)',
        ].join('\n'),
      ),
    );
    expect(addMatchSiteCase(result, 'example-tool', SITE_ID)).toBe(result);
  });

  it('throws when the default branch is missing', () => {
    expect(() => addMatchSiteCase('case x in\nesac', 'a', SITE_ID)).toThrow(
      RegistrationAnchorError,
    );
  });
});

describe('addSitesPyEntry', () => {
  const fixture = [
    'SITES = {',
    '    "baby-cost-calculator": "80001b34-5c40-4b3d-93a1-5f56fd956fa7",',
    '    "fuel-finder": "f6cbe253-9083-4d34-bd91-b80632080494",    ',
    '}',
  ].join('\n');

  it('adds the entry in alphabetical order, ignoring trailing spaces', () => {
    const result = addSitesPyEntry(fixture, 'example-tool', SITE_ID);

    expect(result.split('\n')[2]).toBe(`    "example-tool": "${SITE_ID}",`);
    expect(addSitesPyEntry(result, 'example-tool', SITE_ID)).toBe(result);
  });
});

describe('addGetSiteIdEntry', () => {
  const fixture = [
    'declare -A SITE_IDS=(',
    '  ["fuel-finder"]="f6cbe253-9083-4d34-bd91-b80632080494"',
    '  ["baby-cost-calculator"]="80001b34-5c40-4b3d-93a1-5f56fd956fa7"',
    ')',
  ].join('\n');

  it('appends the entry before the closing bracket', () => {
    const result = addGetSiteIdEntry(fixture, 'example-tool', SITE_ID);

    expect(result).toBe(
      fixture.replace(')', `  ["example-tool"]="${SITE_ID}"\n)`),
    );
    expect(addGetSiteIdEntry(result, 'example-tool', SITE_ID)).toBe(result);
  });
});

describe('test-affected.yml', () => {
  const fixture = [
    'jobs:',
    '  - job: test_fuel_finder_if_affected',
    "    displayName: 'fuel-finder-e2e'",
    "    condition: and(succeeded(), contains(${{ parameters.envstodeploy }}, 'fuel-finder'))",
    '    steps:',
    '      - template: ../steps/run-tests.yml',
    '        parameters:',
    '          compareWithTargetBranch: ${{ parameters.compareWithTargetBranch }}',
    "          projectName: 'fuel-finder'",
    '          testtorun: fuel-finder-e2e',
    '          context: ${{ parameters.context }}',
    '          environment: ${{ parameters.environment }}',
    '          testrunner: playwright',
    '',
    '  - job: post_collated_playwright_reports',
    "    displayName: 'Post Collated Playwright Reports to PR'",
    '    dependsOn:',
    '      - test_fuel_finder_if_affected',
    "    condition: and(always(), ne(variables['System.PullRequest.PullRequestId'], ''))",
    '    steps:',
    '      - checkout: none',
  ].join('\n');

  it('adds the job before the collate job', () => {
    const result = addTestAffectedJob(fixture, 'example-tool');
    const lines = result.split('\n');
    const jobIndex = lines.indexOf('  - job: test_example_tool_if_affected');

    expect(jobIndex).toBe(14);
    expect(lines.slice(jobIndex, jobIndex + 14)).toEqual([
      '  - job: test_example_tool_if_affected',
      "    displayName: 'example-tool-e2e'",
      "    condition: and(succeeded(), contains(${{ parameters.envstodeploy }}, 'example-tool'))",
      '    steps:',
      '      - template: ../steps/run-tests.yml',
      '        parameters:',
      '          compareWithTargetBranch: ${{ parameters.compareWithTargetBranch }}',
      "          projectName: 'example-tool'",
      '          testtorun: example-tool-e2e',
      '          context: ${{ parameters.context }}',
      '          environment: ${{ parameters.environment }}',
      '          testrunner: playwright',
      '',
      '  - job: post_collated_playwright_reports',
    ]);
    expect(addTestAffectedJob(result, 'example-tool')).toBe(result);
  });

  it('adds the job to the collate job dependencies', () => {
    const result = addTestAffectedDependency(fixture, 'example-tool');

    expect(result).toBe(
      fixture.replace(
        '      - test_fuel_finder_if_affected\n',
        '      - test_fuel_finder_if_affected\n      - test_example_tool_if_affected\n',
      ),
    );
    expect(addTestAffectedDependency(result, 'example-tool')).toBe(result);
  });

  it('throws when the collate job is missing', () => {
    expect(() => addTestAffectedJob('jobs:', 'a')).toThrow(
      RegistrationAnchorError,
    );
    expect(() => addTestAffectedDependency('jobs:', 'a')).toThrow(
      RegistrationAnchorError,
    );
  });
});

describe('addPipelineValue', () => {
  const fixture = [
    'parameters:',
    '  - name: appname',
    '    displayName: App to deploy',
    '    type: string',
    '    default: pensions-dashboard',
    '    values:',
    '      - baby-cost-calculator',
    '      - fuel-finder',
    '',
    '  - name: context',
    '    type: string',
  ].join('\n');

  it('adds the value in alphabetical order', () => {
    const result = addPipelineValue(fixture, 'f', 'appname', 'example-tool');

    expect(result).toBe(
      fixture.replace(
        '      - fuel-finder',
        '      - example-tool\n      - fuel-finder',
      ),
    );
    expect(addPipelineValue(result, 'f', 'appname', 'example-tool')).toBe(
      result,
    );
  });

  it('adds a value that sorts last before the blank line', () => {
    expect(addPipelineValue(fixture, 'f', 'appname', 'zebra')).toContain(
      '      - fuel-finder\n      - zebra\n\n  - name: context',
    );
  });

  it('throws when the parameter is missing', () => {
    expect(() => addPipelineValue(fixture, 'f', 'appName', 'a')).toThrow(
      'f: could not find "^ {2}- name: appName$"',
    );
  });
});

describe('addSonarEntries', () => {
  const fixture = [
    'sonar.exclusions=**/node_modules/**/*, \\',
    '                 **/apps/fuel-finder/data/**, \\',
    '                 **/scripts/**/*, \\',
    '',
    'sonar.tests.inclusions=./apps/baby-cost-calculator/**/*.test.*, \\',
    '                       ./apps/fuel-finder/**/*.test.*, \\',
    '                       ./apps/e2e/**/*.cy.ts, \\',
    '                       ./apps/e2e/**/*.spec.ts',
    '',
    'sonar.coverage.exclusions=**/*.json, \\',
    '                          **/apps/fuel-finder/data/**, \\',
    '                          **/apps/e2e/**',
    '',
    'sonar.cpd.exclusions=**/foo, \\',
    '                     **/apps/e2e/**, \\',
    '                     **/apps/**/proxy.ts',
  ].join('\n');

  it('adds the three entries at the end of their sections', () => {
    const result = addSonarEntries(fixture, 'example-tool');

    expect(result.split('\n')).toEqual([
      'sonar.exclusions=**/node_modules/**/*, \\',
      '                 **/apps/fuel-finder/data/**, \\',
      '                 **/apps/example-tool/data/**, \\',
      '                 **/scripts/**/*, \\',
      '',
      'sonar.tests.inclusions=./apps/baby-cost-calculator/**/*.test.*, \\',
      '                       ./apps/fuel-finder/**/*.test.*, \\',
      '                       ./apps/example-tool/**/*.test.*, \\',
      '                       ./apps/e2e/**/*.cy.ts, \\',
      '                       ./apps/e2e/**/*.spec.ts',
      '',
      'sonar.coverage.exclusions=**/*.json, \\',
      '                          **/apps/fuel-finder/data/**, \\',
      '                          **/apps/example-tool/data/**, \\',
      '                          **/apps/e2e/**',
      '',
      'sonar.cpd.exclusions=**/foo, \\',
      '                     **/apps/e2e/**, \\',
      '                     **/apps/**/proxy.ts',
    ]);
    expect(addSonarEntries(result, 'example-tool')).toBe(result);
  });

  it('throws when a section anchor is missing', () => {
    expect(() => addSonarEntries('sonar.exclusions=a', 'a')).toThrow(
      RegistrationAnchorError,
    );
  });
});

describe('addVsCodeScope', () => {
  const fixture = [
    '{',
    '  "conventionalCommits.scopes": [',
    '    "baby-cost-calculator",',
    '    "tools-index",',
    '    "shared-core",',
    '    "shared-ui"',
    '  ]',
    '}',
  ].join('\n');

  it('adds the scope in alphabetical order among the apps', () => {
    const result = addVsCodeScope(fixture, 'example-tool');

    expect(result.split('\n')[3]).toBe('    "example-tool",');
    expect(addVsCodeScope(result, 'example-tool')).toBe(result);
  });

  it('keeps an app that sorts after "shared" before the shared libraries', () => {
    expect(addVsCodeScope(fixture, 'zebra').split('\n')[4]).toBe(
      '    "zebra",',
    );
  });
});

describe('real registry files', () => {
  const read = (file: string) =>
    readFileSync(join(workspaceRoot, file), 'utf-8');
  const name = 'example-tool';

  it('registers the PR title scope between its neighbours', () => {
    const result = addPrTitleScope(read(PR_TITLE_SCOPES_FILE), name);
    const lines = result.split('\n');
    const index = lines.indexOf(`        "${name}",`);

    expect(index).toBeGreaterThan(0);
    expect(lines[index - 1]).toBe('        "evidence-hub",');
    expect(lines[index + 1]).toBe('        "fuel-finder",');
    expect(addPrTitleScope(result, name)).toBe(result);
  });

  it('registers the match-site case before the default branch', () => {
    const result = addMatchSiteCase(read(MATCH_SITE_FILE), name, SITE_ID);
    const lines = result.split('\n');
    const index = lines.indexOf(`        "${name}")`);

    expect(lines.slice(index, index + 6)).toEqual([
      `        "${name}")`,
      `          NETLIFY_SITE_ID="${SITE_ID}"`,
      `          NETLIFY_SITE_FILTER="${name}"`,
      `          NETLIFY_ENV_FILTER="${name}"`,
      '          ;;',
      '        *)',
    ]);
    expect(addMatchSiteCase(result, name, SITE_ID)).toBe(result);
  });

  it('registers the site id in sites.py and get-site-id.sh', () => {
    const sitesPy = addSitesPyEntry(read(SITES_PY_FILE), name, SITE_ID);
    const sitesPyLines = sitesPy.split('\n');
    const sitesPyIndex = sitesPyLines.indexOf(`    "${name}": "${SITE_ID}",`);

    expect(sitesPyLines[sitesPyIndex - 1]).toContain('"evidence-hub"');
    expect(sitesPyLines[sitesPyIndex + 1]).toContain('"fuel-finder"');
    expect(addSitesPyEntry(sitesPy, name, SITE_ID)).toBe(sitesPy);

    const getSiteId = addGetSiteIdEntry(read(GET_SITE_ID_FILE), name, SITE_ID);

    expect(getSiteId).toContain(`  ["${name}"]="${SITE_ID}"\n)\n`);
    expect(addGetSiteIdEntry(getSiteId, name, SITE_ID)).toBe(getSiteId);
  });

  it('registers the e2e job and its dependency in test-affected.yml', () => {
    const withJob = addTestAffectedJob(read(TEST_AFFECTED_FILE), name);
    const result = addTestAffectedDependency(withJob, name);
    const lines = result.split('\n');
    const jobIndex = lines.indexOf('  - job: test_example_tool_if_affected');
    const collateIndex = lines.indexOf(
      '  - job: post_collated_playwright_reports',
    );
    const dependencyIndex = lines.indexOf(
      '      - test_example_tool_if_affected',
    );

    expect(jobIndex).toBeGreaterThan(0);
    expect(lines[jobIndex - 1]).toBe('');
    expect(lines[jobIndex + 11]).toBe('          testrunner: playwright');
    expect(lines[jobIndex + 12]).toBe('');
    expect(collateIndex).toBe(jobIndex + 13);
    expect(dependencyIndex).toBeGreaterThan(collateIndex);
    expect(lines[dependencyIndex + 1]).toMatch(
      /^ {4}condition: and\(always\(\)/,
    );
    expect(count(result, 'test_example_tool_if_affected')).toBe(2);
    expect(
      addTestAffectedDependency(addTestAffectedJob(result, name), name),
    ).toBe(result);
  });

  it.each(Object.entries(PIPELINE_APP_LISTS))(
    'registers the app in %s between its neighbours',
    (file, parameterName) => {
      const result = addPipelineValue(read(file), file, parameterName, name);
      const lines = result.split('\n');
      const index = lines.indexOf(`      - ${name}`);

      expect(index).toBeGreaterThan(0);
      expect(lines[index - 1]).toBe('      - evidence-hub');
      expect(lines[index + 1]).toBe('      - fuel-finder');
      expect(addPipelineValue(result, file, parameterName, name)).toBe(result);
    },
  );

  it('registers the app in the three sonar sections', () => {
    const result = addSonarEntries(read(SONAR_FILE), name);

    expect(
      count(
        result,
        `                 **/apps/${name}/data/**, \\\n                 **/scripts/**/*, \\`,
      ),
    ).toBe(1);
    expect(
      count(
        result,
        `                       ./apps/${name}/**/*.test.*, \\\n                       ./apps/e2e/**/*.cy.ts, \\`,
      ),
    ).toBe(1);
    expect(
      count(
        result,
        `                          **/apps/${name}/data/**, \\\n                          **/apps/e2e/**\n`,
      ),
    ).toBe(1);
    expect(count(result, `apps/${name}/`)).toBe(3);
    expect(addSonarEntries(result, name)).toBe(result);
  });

  it('registers the VS Code commit scope among the apps', () => {
    const result = addVsCodeScope(read(VSCODE_SETTINGS_FILE), name);
    const lines = result.split('\n');
    const index = lines.indexOf(`    "${name}",`);

    expect(lines[index - 1]).toBe('    "evidence-hub",');
    expect(lines[index + 1]).toBe('    "fuel-finder",');
    expect(JSON.parse(result)['conventionalCommits.scopes']).toContain(name);
    expect(addVsCodeScope(result, name)).toBe(result);
  });
});

describe('registerApp', () => {
  const seed = (files: Record<string, string>) => {
    const tree = createTreeWithEmptyWorkspace();
    for (const [file, content] of Object.entries(files)) {
      tree.write(file, content);
    }
    return tree;
  };

  const sonarFixture = [
    '                 **/scripts/**/*, \\',
    '                       ./apps/e2e/**/*.cy.ts, \\',
    '                          **/apps/e2e/**',
  ].join('\n');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates every enabled file and skips the site id files without an id', () => {
    const tree = seed({
      [PR_TITLE_SCOPES_FILE]: '    "Apps": [\n    ],',
      [MATCH_SITE_FILE]: '        *)',
      [SITES_PY_FILE]: 'SITES = {\n}',
      [GET_SITE_ID_FILE]: 'declare -A SITE_IDS=(\n)',
      [TEST_AFFECTED_FILE]:
        '  - job: post_collated_playwright_reports\n    dependsOn:\n      - other\n    condition: x',
      ...Object.fromEntries(
        Object.entries(PIPELINE_APP_LISTS).map(([file, parameterName]) => [
          file,
          `  - name: ${parameterName}\n    values:\n      - zzz\n`,
        ]),
      ),
      [SONAR_FILE]: sonarFixture,
      [VSCODE_SETTINGS_FILE]:
        '  "conventionalCommits.scopes": [\n    "shared-core"\n  ]',
    });

    const result = registerApp(tree, { name: 'example-tool', e2e: true });

    expect(result.manualSteps).toEqual([]);
    expect(result.updated).toEqual([
      PR_TITLE_SCOPES_FILE,
      TEST_AFFECTED_FILE,
      ...Object.keys(PIPELINE_APP_LISTS),
      SONAR_FILE,
      VSCODE_SETTINGS_FILE,
    ]);
    expect(tree.read(MATCH_SITE_FILE, 'utf-8')).toBe('        *)');
    expect(tree.read(SITES_PY_FILE, 'utf-8')).toBe('SITES = {\n}');
    expect(tree.read(GET_SITE_ID_FILE, 'utf-8')).toBe(
      'declare -A SITE_IDS=(\n)',
    );
    expect(tree.read(VSCODE_SETTINGS_FILE, 'utf-8')).toContain(
      '    "example-tool",\n    "shared-core"',
    );
  });

  it('writes the site id files when an id is given and skips the e2e job when e2e is off', () => {
    const tree = seed({
      [MATCH_SITE_FILE]: '        *)',
      [SITES_PY_FILE]: 'SITES = {\n}',
      [GET_SITE_ID_FILE]: 'declare -A SITE_IDS=(\n)',
      [TEST_AFFECTED_FILE]: '  - job: post_collated_playwright_reports',
    });

    const result = registerApp(tree, {
      name: 'example-tool',
      netlifySiteId: SITE_ID,
      e2e: false,
    });

    expect(result.updated).toEqual([
      MATCH_SITE_FILE,
      SITES_PY_FILE,
      GET_SITE_ID_FILE,
    ]);
    expect(tree.read(SITES_PY_FILE, 'utf-8')).toBe(
      `SITES = {\n    "example-tool": "${SITE_ID}",\n}`,
    );
    expect(tree.read(TEST_AFFECTED_FILE, 'utf-8')).toBe(
      '  - job: post_collated_playwright_reports',
    );
  });

  it('warns and lists a manual step when a file or anchor is missing', () => {
    const tree = seed({ [SONAR_FILE]: 'sonar.exclusions=nothing' });

    const result = registerApp(tree, { name: 'example-tool', e2e: false });

    expect(result.updated).toEqual([]);
    expect(result.manualSteps).toHaveLength(9);
    expect(result.manualSteps).toContain(
      `add "example-tool" to VALID_SCOPES["Apps"] in ${PR_TITLE_SCOPES_FILE}`,
    );
    expect(result.manualSteps).toContain(
      `add apps/example-tool to sonar.exclusions, sonar.tests.inclusions and sonar.coverage.exclusions in ${SONAR_FILE}`,
    );
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining(`${PR_TITLE_SCOPES_FILE} was not found`),
    );
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining(`${SONAR_FILE}: could not find`),
    );
  });
});
