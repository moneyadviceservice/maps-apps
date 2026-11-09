import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { formatFiles, logger, Tree, workspaceRoot } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import appGenerator from './generator';
import {
  addPrTitleScope,
  GET_SITE_ID_FILE,
  MATCH_SITE_FILE,
  PIPELINE_APP_LISTS,
  PR_TITLE_SCOPES_FILE,
  SITES_PY_FILE,
  SONAR_FILE,
  TEST_AFFECTED_FILE,
  VSCODE_SETTINGS_FILE,
} from './registrations';
import { SHARED_PUBLIC_ASSETS, SHARED_PUBLIC_DIR } from './utils';

jest.mock('@nx/devkit', () => ({
  ...jest.requireActual('@nx/devkit'),
  formatFiles: jest.fn().mockResolvedValue(undefined),
}));

jest.spyOn(logger, 'warn').mockImplementation(() => undefined);
jest.spyOn(logger, 'info').mockImplementation(() => undefined);

const REGISTRY_FILES = [
  PR_TITLE_SCOPES_FILE,
  MATCH_SITE_FILE,
  SITES_PY_FILE,
  GET_SITE_ID_FILE,
  TEST_AFFECTED_FILE,
  ...Object.keys(PIPELINE_APP_LISTS),
  SONAR_FILE,
  VSCODE_SETTINGS_FILE,
];

const SITE_ID = '0f1e2d3c-4b5a-4968-8776-655443322110';
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0xff]);

const count = (content: string, needle: string) =>
  content.split(needle).length - 1;

const read = (tree: Tree, path: string) => tree.read(path, 'utf-8') as string;

const readJson = (tree: Tree, path: string) => JSON.parse(read(tree, path));

const writeProject = (tree: Tree, root: string, port?: number) => {
  tree.write(
    `${root}/project.json`,
    JSON.stringify({
      name: root.split('/').pop(),
      targets: port ? { serve: { options: { port } } } : {},
    }),
  );
};

const createTree = () => {
  const tree = createTreeWithEmptyWorkspace();

  for (const file of REGISTRY_FILES) {
    tree.write(file, readFileSync(join(workspaceRoot, file), 'utf-8'));
  }

  tree.write(`${SHARED_PUBLIC_DIR}/maps-logo.png`, PNG);
  for (const asset of SHARED_PUBLIC_ASSETS.slice(1)) {
    tree.write(`${SHARED_PUBLIC_DIR}/${asset}`, asset);
  }

  writeProject(tree, 'apps/budget-planner', 4300);
  writeProject(tree, 'apps/credit-rejection', 4302);
  writeProject(tree, 'libs/shared/ui');

  return tree;
};

const listFiles = (tree: Tree, directory: string): string[] =>
  tree.children(directory).flatMap((child) => {
    const path = `${directory}/${child}`;
    return tree.isFile(path) ? [path] : listFiles(tree, path);
  });

describe('app generator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates the app with the seven standard targets on the next free port', async () => {
    const tree = createTree();

    await appGenerator(tree, { name: 'example-tool' });

    const projectJson = readJson(tree, 'apps/example-tool/project.json');

    expect(projectJson.name).toBe('example-tool');
    expect(projectJson.sourceRoot).toBe('apps/example-tool');
    expect(Object.keys(projectJson.targets)).toEqual([
      'build',
      'serve',
      'export',
      'test',
      'snapshots',
      'lint',
      'typecheck',
    ]);
    expect(projectJson.targets.serve.options.port).toBe(4301);
    expect(projectJson.targets.typecheck.options.cwd).toBe('apps/example-tool');

    const netlifyToml = read(tree, 'apps/example-tool/netlify.toml');

    expect(netlifyToml).toContain('targetPort = 4301');
    expect(netlifyToml).toContain('command = "npx nx run example-tool:serve"');
    expect(netlifyToml).toContain('apps/example-tool package.json libs/shared');
    expect(formatFiles).toHaveBeenCalled();
  });

  it('generates the corrected config files', async () => {
    const tree = createTree();

    await appGenerator(tree, { name: 'example-tool' });

    expect(read(tree, 'apps/example-tool/tailwind.config.js')).toContain(
      "'{pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'",
    );

    const tsconfig = readJson(tree, 'apps/example-tool/tsconfig.json');

    expect(tsconfig.exclude).toContain('.next');
    expect(tsconfig.include).not.toContain('**/*.mts');

    expect(read(tree, 'apps/example-tool/jest.config.ts')).toContain(
      "moduleDirectories: ['node_modules', '<rootDir>']",
    );
    expect(read(tree, 'apps/example-tool/eslint.config.mjs')).toContain(
      "'@next/next/no-html-link-for-pages': ['error', 'apps/example-tool/pages']",
    );

    const nextConfig = read(tree, 'apps/example-tool/next.config.js');

    expect(nextConfig).toContain(
      "withCSPHeaders({ reportOnly: false, overrides: { 'frame-ancestors': '*' } })",
    );
    expect(nextConfig).toContain(
      "require('../../libs/shared/utils/src/baseNextConfig')",
    );
    expect(nextConfig).toContain('...baseNextConfig');
    expect(nextConfig).toContain("destination: '/en'");
    expect(read(tree, 'apps/example-tool/.env.example')).toContain(
      'NEXT_PUBLIC_ENVIRONMENT=',
    );
    expect(read(tree, 'apps/example-tool/README.md')).toContain(
      '# Example Tool',
    );
  });

  it('generates the sample page, component and test with English and Welsh copy', async () => {
    const tree = createTree();

    await appGenerator(tree, { name: 'example-tool' });

    const page = read(tree, 'apps/example-tool/pages/[language]/index.tsx');

    expect(page).toContain('const ExampleToolPage = ');
    expect(page).toContain("const title = t('site.title');");
    expect(page).toContain('<ToolPageLayout');
    expect(page).toContain('<EmbedPageLayout');

    expect(
      read(tree, 'apps/example-tool/components/Landing/Landing.tsx'),
    ).toContain("t('components.landing.intro')");
    expect(readJson(tree, 'apps/example-tool/public/locales/en.json')).toEqual({
      site: { title: 'Example Tool' },
      components: {
        landing: {
          intro: expect.stringContaining(
            'This is the starting page for Example Tool.',
          ),
        },
      },
    });
    expect(readJson(tree, 'apps/example-tool/public/locales/cy.json')).toEqual({
      site: { title: 'Example Tool' },
      components: {
        landing: {
          intro: expect.stringContaining('Dyma dudalen gychwyn Example Tool.'),
        },
      },
    });
    expect(
      read(tree, 'apps/example-tool/components/Landing/Landing.test.tsx'),
    ).toContain("['cy', 'Dyma dudalen gychwyn Example Tool.']");
    expect(read(tree, 'apps/example-tool/components/Landing/index.ts')).toBe(
      "export * from './Landing';\n",
    );
    expect(read(tree, 'apps/example-tool/pages/_app.tsx')).toContain(
      "<title>{t('site.title')}</title>",
    );
    expect(tree.exists('apps/example-tool/pages/_document.tsx')).toBe(true);
    expect(tree.exists('apps/example-tool/pages/api/embed.ts')).toBe(true);
  });

  it('copies the public assets and leaves no template markers behind', async () => {
    const tree = createTree();

    await appGenerator(tree, { name: 'example-tool' });

    expect(tree.exists('apps/example-tool/public/iframeResizer.js')).toBe(true);
    expect(tree.exists('apps/example-tool/public/iframeResizer.map')).toBe(
      true,
    );
    expect(
      tree.exists('apps/example-tool/public/iframeResizer.contentWindow.js'),
    ).toBe(true);
    expect(
      tree.exists('apps/example-tool/public/iframeResizer.contentWindow.map'),
    ).toBe(true);
    expect(
      tree.read('apps/example-tool/public/maps-logo.png')?.equals(PNG),
    ).toBe(true);
    expect(read(tree, 'apps/example-tool/public/footer/gov-cy.svg')).toBe(
      'footer/gov-cy.svg',
    );

    const files = listFiles(tree, 'apps/example-tool');

    expect(files).toHaveLength(25 + SHARED_PUBLIC_ASSETS.length);
    expect(files.filter((file) => file.includes('__'))).toEqual([]);
    expect(files.filter((file) => read(tree, file).includes('<%'))).toEqual([]);
  });

  it('creates the e2e project and registers the app in the repo files', async () => {
    const tree = createTree();

    await appGenerator(tree, { name: 'example-tool' });

    expect(tree.exists('apps/e2e/example-tool-e2e/project.json')).toBe(true);
    expect(
      read(tree, 'apps/e2e/example-tool-e2e/playwright.config.ts'),
    ).toContain('4301');

    const testAffected = read(tree, TEST_AFFECTED_FILE);

    expect(count(testAffected, '  - job: test_example_tool_if_affected')).toBe(
      1,
    );
    expect(count(testAffected, '      - test_example_tool_if_affected')).toBe(
      1,
    );

    expect(read(tree, PR_TITLE_SCOPES_FILE)).toContain(
      '        "evidence-hub",\n        "example-tool",\n        "fuel-finder",',
    );
    for (const file of Object.keys(PIPELINE_APP_LISTS)) {
      expect(read(tree, file)).toContain(
        '      - evidence-hub\n      - example-tool\n      - fuel-finder',
      );
    }
    expect(count(read(tree, SONAR_FILE), 'apps/example-tool/')).toBe(3);
    expect(
      readJson(tree, VSCODE_SETTINGS_FILE)['conventionalCommits.scopes'],
    ).toContain('example-tool');

    for (const file of [MATCH_SITE_FILE, SITES_PY_FILE, GET_SITE_ID_FILE]) {
      expect(read(tree, file)).not.toContain('example-tool');
    }

    expect(logger.info).toHaveBeenCalledWith(
      'NX apps/example-tool created on port 4301',
    );
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(
        'netlify/scripts/sites.py           "example-tool": "<site id>",',
      ),
    );
  });

  it('registers the site id when given', async () => {
    const tree = createTree();

    await appGenerator(tree, { name: 'example-tool', netlifySiteId: SITE_ID });

    expect(read(tree, MATCH_SITE_FILE)).toContain(
      `        "example-tool")\n          NETLIFY_SITE_ID="${SITE_ID}"`,
    );
    expect(read(tree, SITES_PY_FILE)).toContain(
      `    "example-tool": "${SITE_ID}",`,
    );
    expect(read(tree, GET_SITE_ID_FILE)).toContain(
      `  ["example-tool"]="${SITE_ID}"`,
    );
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('change NETLIFY_ENV_FILTER'),
    );
  });

  it('skips the e2e project and its pipeline job with --e2e=false', async () => {
    const tree = createTree();
    const testAffectedBefore = read(tree, TEST_AFFECTED_FILE);

    await appGenerator(tree, { name: 'example-tool', e2e: false });

    expect(tree.exists('apps/e2e/example-tool-e2e')).toBe(false);
    expect(read(tree, TEST_AFFECTED_FILE)).toBe(testAffectedBefore);
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('e2e-generate example-tool'),
    );
  });

  it('honours an explicit free port', async () => {
    const tree = createTree();

    await appGenerator(tree, { name: 'example-tool', port: 4400 });

    expect(
      readJson(tree, 'apps/example-tool/project.json').targets.serve.options
        .port,
    ).toBe(4400);
    expect(read(tree, 'apps/example-tool/netlify.toml')).toContain(
      'targetPort = 4400',
    );
  });

  it('counts netlify.toml and e2e ports as used', async () => {
    const tree = createTree();
    tree.write(
      'apps/credit-rejection/netlify.toml',
      '[dev]\n    targetPort = 4301\n',
    );
    tree.write(
      'apps/e2e/tools-index-e2e/project.json',
      JSON.stringify({ targets: { e2e: { options: { port: 4303 } } } }),
    );

    await appGenerator(tree, { name: 'example-tool' });

    expect(
      readJson(tree, 'apps/example-tool/project.json').targets.serve.options
        .port,
    ).toBe(4304);
  });

  it('rejects a port that another project uses', async () => {
    const tree = createTree();

    await expect(
      appGenerator(tree, { name: 'example-tool', port: 4300 }),
    ).rejects.toThrow(
      'Port 4300 is already used by budget-planner (apps/budget-planner/project.json targets.serve). Pick another --port or omit it to use the next free port.',
    );
    expect(tree.exists('apps/example-tool')).toBe(false);
  });

  it.each(['Example_Tool', 'example tool', '', 'example-tool-e2e'])(
    'rejects the name "%s" with a clear message',
    async (name) => {
      const tree = createTree();

      await expect(appGenerator(tree, { name })).rejects.toThrow(
        `Invalid app name "${name}"`,
      );
    },
  );

  it('rejects a name that already exists as a project or folder', async () => {
    const tree = createTree();
    tree.write('apps/orphan/README.md', '');
    tree.write('apps/e2e/taken-e2e/project.json', '{}');

    await expect(
      appGenerator(tree, { name: 'budget-planner' }),
    ).rejects.toThrow(
      'Project "budget-planner" already exists at apps/budget-planner.',
    );
    await expect(appGenerator(tree, { name: 'ui' })).rejects.toThrow(
      'Project "ui" already exists at libs/shared/ui.',
    );
    await expect(appGenerator(tree, { name: 'orphan' })).rejects.toThrow(
      'Folder apps/orphan already exists.',
    );
    await expect(appGenerator(tree, { name: 'taken' })).rejects.toThrow(
      'E2E project folder apps/e2e/taken-e2e already exists.',
    );
  });

  it('rejects an invalid site id', async () => {
    const tree = createTree();

    await expect(
      appGenerator(tree, { name: 'example-tool', netlifySiteId: 'nope' }),
    ).rejects.toThrow('Invalid --netlifySiteId "nope"');
  });

  it('does not duplicate registrations that already exist', async () => {
    const tree = createTree();
    tree.write(
      PR_TITLE_SCOPES_FILE,
      addPrTitleScope(read(tree, PR_TITLE_SCOPES_FILE), 'example-tool'),
    );

    await appGenerator(tree, { name: 'example-tool' });

    expect(count(read(tree, PR_TITLE_SCOPES_FILE), '"example-tool"')).toBe(1);
  });

  it('warns and lists a manual step when a registry file is missing', async () => {
    const tree = createTree();
    tree.delete(SONAR_FILE);

    await appGenerator(tree, { name: 'example-tool' });

    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining(`${SONAR_FILE} was not found`),
    );
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(
        `add apps/example-tool to sonar.exclusions, sonar.tests.inclusions and sonar.coverage.exclusions in ${SONAR_FILE}`,
      ),
    );
  });

  it('warns when the name overlaps with an existing project', async () => {
    const tree = createTree();

    await appGenerator(tree, { name: 'budget' });

    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        '"budget" overlaps with the existing project "budget-planner"',
      ),
    );
  });
});
