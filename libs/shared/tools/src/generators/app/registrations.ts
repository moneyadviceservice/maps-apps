import { logger, Tree } from '@nx/devkit';

import { toJobId } from './utils';

export class RegistrationAnchorError extends Error {
  constructor(public readonly file: string, public readonly anchor: string) {
    super(`${file}: could not find "${anchor}"`);
    this.name = 'RegistrationAnchorError';
  }
}

type ListSpec = {
  start: RegExp;
  entry: RegExp;
  end: RegExp;
  line: string;
  key: string;
  sorted: boolean;
};

/**
 * Inserts a line into a list bounded by `start` and `end`, keeping the
 * content unchanged when the key is already present.
 */
export function insertListEntry(content: string, spec: ListSpec, file: string) {
  const lines = content.split('\n');
  const startIndex = lines.findIndex((line) => spec.start.test(line));

  if (startIndex === -1) {
    throw new RegistrationAnchorError(file, spec.start.source);
  }

  for (let index = startIndex + 1; index < lines.length; index++) {
    if (spec.end.test(lines[index])) {
      lines.splice(index, 0, spec.line);
      return lines.join('\n');
    }

    const entry = spec.entry.exec(lines[index]);
    if (!entry) {
      continue;
    }

    if (entry[1] === spec.key) {
      return content;
    }

    if (spec.sorted && entry[1] > spec.key) {
      lines.splice(index, 0, spec.line);
      return lines.join('\n');
    }
  }

  throw new RegistrationAnchorError(file, spec.end.source);
}

/** Inserts `block` before the first line equal to `anchor`, once. */
function insertBefore(
  content: string,
  anchor: string,
  block: string,
  alreadyPresent: string,
  file: string,
) {
  if (content.includes(alreadyPresent)) {
    return content;
  }

  const lines = content.split('\n');
  const anchorIndex = lines.indexOf(anchor);

  if (anchorIndex === -1) {
    throw new RegistrationAnchorError(file, anchor);
  }

  lines.splice(anchorIndex, 0, ...block.split('\n'));
  return lines.join('\n');
}

export const PR_TITLE_SCOPES_FILE = 'netlify/scripts/validate-pr-title.py';
export const MATCH_SITE_FILE = 'netlify/templates/match-site.yml';
export const SITES_PY_FILE = 'netlify/scripts/sites.py';
export const GET_SITE_ID_FILE = 'netlify/scripts/get-site-id.sh';
export const TEST_AFFECTED_FILE = 'netlify/templates/test-affected.yml';
export const SONAR_FILE = 'sonarqube/sonar-project.properties';
export const VSCODE_SETTINGS_FILE = '.vscode/settings.json';
export const PIPELINE_APP_LISTS: Record<string, string> = {
  'netlify/netlify-azure-pipelines.yml': 'appname',
  'netlify/netlify-branch-deploy.yml': 'appname',
  'netlify/netlify-branch-env-unset.yml': 'appName',
  'netlify/netlify-restore-env-vars.yml': 'appName',
  'netlify/netlify-redeploy-published.yml': 'appName',
  'netlify/netlify-relink.yml': 'projectNames',
};

export function addPrTitleScope(content: string, name: string) {
  return insertListEntry(
    content,
    {
      start: /^ {4}"Apps": \[$/,
      entry: /^ {8}"([^"]+)",$/,
      end: /^ {4}\],$/,
      line: `        "${name}",`,
      key: name,
      sorted: true,
    },
    PR_TITLE_SCOPES_FILE,
  );
}

export function addMatchSiteCase(
  content: string,
  name: string,
  siteId: string,
  envFilter = name,
) {
  return insertBefore(
    content,
    '        *)',
    [
      `        "${name}")`,
      `          NETLIFY_SITE_ID="${siteId}"`,
      `          NETLIFY_SITE_FILTER="${name}"`,
      `          NETLIFY_ENV_FILTER="${envFilter}"`,
      '          ;;',
    ].join('\n'),
    `        "${name}")`,
    MATCH_SITE_FILE,
  );
}

export function addSitesPyEntry(content: string, name: string, siteId: string) {
  return insertListEntry(
    content,
    {
      start: /^SITES = \{$/,
      entry: /^ {4}"([^"]+)": "[^"]*",\s*$/,
      end: /^\}$/,
      line: `    "${name}": "${siteId}",`,
      key: name,
      sorted: true,
    },
    SITES_PY_FILE,
  );
}

export function addGetSiteIdEntry(
  content: string,
  name: string,
  siteId: string,
) {
  return insertListEntry(
    content,
    {
      start: /^declare -A SITE_IDS=\($/,
      entry: /^ {2}\["([^"]+)"\]="[^"]*"$/,
      end: /^\)$/,
      line: `  ["${name}"]="${siteId}"`,
      key: name,
      sorted: false,
    },
    GET_SITE_ID_FILE,
  );
}

const TEST_AFFECTED_COLLATE_JOB = '  - job: post_collated_playwright_reports';

export function addTestAffectedJob(content: string, name: string) {
  const jobId = `test_${toJobId(name)}_if_affected`;

  return insertBefore(
    content,
    TEST_AFFECTED_COLLATE_JOB,
    [
      `  - job: ${jobId}`,
      `    displayName: '${name}-e2e'`,
      `    condition: and(succeeded(), contains(\${{ parameters.envstodeploy }}, '${name}'))`,
      '    steps:',
      '      - template: ../steps/run-tests.yml',
      '        parameters:',
      '          compareWithTargetBranch: ${{ parameters.compareWithTargetBranch }}',
      `          projectName: '${name}'`,
      `          testtorun: ${name}-e2e`,
      '          context: ${{ parameters.context }}',
      '          environment: ${{ parameters.environment }}',
      '          testrunner: playwright',
      '',
    ].join('\n'),
    `  - job: ${jobId}`,
    TEST_AFFECTED_FILE,
  );
}

export function addTestAffectedDependency(content: string, name: string) {
  const jobId = `test_${toJobId(name)}_if_affected`;
  const collateJobIndex = content.indexOf(TEST_AFFECTED_COLLATE_JOB);

  if (collateJobIndex === -1) {
    throw new RegistrationAnchorError(
      TEST_AFFECTED_FILE,
      TEST_AFFECTED_COLLATE_JOB,
    );
  }

  const head = content.slice(0, collateJobIndex);
  const tail = insertListEntry(
    content.slice(collateJobIndex),
    {
      start: /^ {4}dependsOn:$/,
      entry: /^ {6}- (\S+)$/,
      end: /^(?! {6}- )\S|^ {4}\S/,
      line: `      - ${jobId}`,
      key: jobId,
      sorted: false,
    },
    TEST_AFFECTED_FILE,
  );

  return head + tail;
}

export function addPipelineValue(
  content: string,
  file: string,
  parameterName: string,
  name: string,
) {
  return insertListEntry(
    content,
    {
      start: new RegExp(`^ {2}- name: ${parameterName}$`),
      entry: /^ {6}- (\S+)$/,
      end: /^\s*$|^ {2}- name: |^\S/,
      line: `      - ${name}`,
      key: name,
      sorted: true,
    },
    file,
  );
}

export function addSonarEntries(content: string, name: string) {
  const withExclusion = insertBefore(
    content,
    '                 **/scripts/**/*, \\',
    `                 **/apps/${name}/data/**, \\`,
    `                 **/apps/${name}/data/**, \\`,
    SONAR_FILE,
  );

  const withTestInclusion = insertBefore(
    withExclusion,
    '                       ./apps/e2e/**/*.cy.ts, \\',
    `                       ./apps/${name}/**/*.test.*, \\`,
    `                       ./apps/${name}/**/*.test.*, \\`,
    SONAR_FILE,
  );

  return insertBefore(
    withTestInclusion,
    '                          **/apps/e2e/**',
    `                          **/apps/${name}/data/**, \\`,
    `                          **/apps/${name}/data/**, \\`,
    SONAR_FILE,
  );
}

export function addVsCodeScope(content: string, name: string) {
  return insertListEntry(
    content,
    {
      start: /^ {2}"conventionalCommits\.scopes": \[$/,
      entry: /^ {4}"([^"]+)",$/,
      end: /^ {4}"shared-|^ {2}\],?$/,
      line: `    "${name}",`,
      key: name,
      sorted: true,
    },
    VSCODE_SETTINGS_FILE,
  );
}

type Registration = {
  file: string;
  apply: (content: string) => string;
  /** What to do by hand when the file or its anchor is missing. */
  manualStep: string;
  enabled: boolean;
};

export function registerApp(
  tree: Tree,
  {
    name,
    netlifySiteId,
    e2e,
  }: { name: string; netlifySiteId?: string; e2e: boolean },
) {
  const siteId = netlifySiteId ?? '';

  const registrations: Registration[] = [
    {
      file: PR_TITLE_SCOPES_FILE,
      apply: (content) => addPrTitleScope(content, name),
      manualStep: `add "${name}" to VALID_SCOPES["Apps"] in ${PR_TITLE_SCOPES_FILE}`,
      enabled: true,
    },
    {
      file: MATCH_SITE_FILE,
      apply: (content) => addMatchSiteCase(content, name, siteId),
      manualStep: `add a "${name}") case before *) in ${MATCH_SITE_FILE}`,
      enabled: Boolean(netlifySiteId),
    },
    {
      file: SITES_PY_FILE,
      apply: (content) => addSitesPyEntry(content, name, siteId),
      manualStep: `add "${name}": "${siteId}", to SITES in ${SITES_PY_FILE}`,
      enabled: Boolean(netlifySiteId),
    },
    {
      file: GET_SITE_ID_FILE,
      apply: (content) => addGetSiteIdEntry(content, name, siteId),
      manualStep: `add ["${name}"]="${siteId}" to SITE_IDS in ${GET_SITE_ID_FILE}`,
      enabled: Boolean(netlifySiteId),
    },
    {
      file: TEST_AFFECTED_FILE,
      apply: (content) =>
        addTestAffectedDependency(addTestAffectedJob(content, name), name),
      manualStep: `add a test_${toJobId(
        name,
      )}_if_affected job to ${TEST_AFFECTED_FILE} and list it under dependsOn of post_collated_playwright_reports`,
      enabled: e2e,
    },
    ...Object.entries(PIPELINE_APP_LISTS).map(([file, parameterName]) => ({
      file,
      apply: (content: string) =>
        addPipelineValue(content, file, parameterName, name),
      manualStep: `add "- ${name}" to the ${parameterName} values in ${file}`,
      enabled: true,
    })),
    {
      file: SONAR_FILE,
      apply: (content) => addSonarEntries(content, name),
      manualStep: `add apps/${name} to sonar.exclusions, sonar.tests.inclusions and sonar.coverage.exclusions in ${SONAR_FILE}`,
      enabled: true,
    },
    {
      file: VSCODE_SETTINGS_FILE,
      apply: (content) => addVsCodeScope(content, name),
      manualStep: `add "${name}" to conventionalCommits.scopes in ${VSCODE_SETTINGS_FILE}`,
      enabled: true,
    },
  ];

  const updated: string[] = [];
  const manualSteps: string[] = [];

  for (const registration of registrations) {
    if (!registration.enabled) {
      continue;
    }

    const content = tree.read(registration.file, 'utf-8');

    if (content === null) {
      logger.warn(
        `${registration.file} was not found: ${registration.manualStep}.`,
      );
      manualSteps.push(registration.manualStep);
      continue;
    }

    let next: string;
    try {
      next = registration.apply(content);
    } catch (error) {
      if (!(error instanceof RegistrationAnchorError)) {
        throw error;
      }
      logger.warn(`${error.message}: ${registration.manualStep}.`);
      manualSteps.push(registration.manualStep);
      continue;
    }

    if (next !== content) {
      tree.write(registration.file, next);
      updated.push(registration.file);
    }
  }

  return { updated, manualSteps };
}
