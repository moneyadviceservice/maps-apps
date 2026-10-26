import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import {
  APPLICATION_NAME_TOKEN,
  getPortNumber,
  listFilesRecursively,
  normalizeE2EProjectName,
  PORT_NUMBER_TOKEN,
  readProjectConfig,
  readRequiredFile,
  reorderProjectConfig,
  replaceTokensInFiles,
  writeProjectConfig,
} from './utils';

describe('playwright generator utils', () => {
  it('normalizes app names for e2e projects', () => {
    expect(normalizeE2EProjectName('budget-planner')).toBe(
      'budget-planner-e2e',
    );
    expect(normalizeE2EProjectName('apps/e2e/budget-planner-e2e')).toBe(
      'budget-planner-e2e',
    );
    expect(normalizeE2EProjectName('apps/budget-planner')).toBe(
      'budget-planner-e2e',
    );
  });

  it('lists files recursively from a tree directory', () => {
    const tree = createTreeWithEmptyWorkspace();
    tree.write('apps/e2e/budget-planner-e2e/src/example.spec.ts', 'test');
    tree.write('apps/e2e/budget-planner-e2e/playwright.config.ts', 'export {}');

    const files = listFilesRecursively(tree, 'apps/e2e/budget-planner-e2e');

    expect(files).toEqual(
      expect.arrayContaining([
        'apps/e2e/budget-planner-e2e/src/example.spec.ts',
        'apps/e2e/budget-planner-e2e/playwright.config.ts',
      ]),
    );
  });

  it('reads required files and parses project config', () => {
    const tree = createTreeWithEmptyWorkspace();
    tree.write('apps/budget-planner/project.json', '{"name":"budget-planner"}');

    expect(readRequiredFile(tree, 'apps/budget-planner/project.json')).toBe(
      '{"name":"budget-planner"}',
    );
    expect(readProjectConfig(tree, 'apps/budget-planner/project.json')).toEqual(
      {
        name: 'budget-planner',
      },
    );
    expect(() => readRequiredFile(tree, 'apps/missing/project.json')).toThrow(
      'Could not read apps/missing/project.json',
    );
  });

  it('returns the configured port or throws when missing', () => {
    const projectConfig = {
      targets: {
        serve: {
          options: {
            port: 4200,
          },
        },
      },
    };

    expect(
      getPortNumber(projectConfig as never, 'apps/budget-planner/project.json'),
    ).toBe(4200);

    expect(() =>
      getPortNumber(
        { targets: {} } as never,
        'apps/budget-planner/project.json',
      ),
    ).toThrow(
      'apps/budget-planner/project.json does not contain a port number under targets.serve.options.port',
    );
  });

  it('reorders project config keys while preserving data', () => {
    const projectConfig = {
      targets: {},
      name: 'budget-planner',
      tags: ['scope:shared'],
      extra: true,
      implicitDependencies: ['budget-planner-e2e'],
    } as Record<string, unknown>;

    const reordered = reorderProjectConfig(projectConfig);
    expect(Object.keys(reordered)).toEqual([
      'name',
      'implicitDependencies',
      'tags',
      'targets',
      'extra',
    ]);
  });

  it('writes project config and replaces tokens in files', () => {
    const tree = createTreeWithEmptyWorkspace();
    tree.write('apps/budget-planner/project.json', '{"name":"budget-planner"}');
    tree.write(
      'apps/e2e/budget-planner-e2e/playwright.config.ts',
      'port=<PORT_NUMBER>',
    );
    tree.write(
      'apps/e2e/budget-planner-e2e/src/example.spec.ts',
      'name=<APPLICATION_NAME>',
    );

    writeProjectConfig(tree, 'apps/budget-planner/project.json', {
      name: 'budget-planner',
      implicitDependencies: ['budget-planner-e2e'],
    } as Record<string, unknown>);

    replaceTokensInFiles(
      tree,
      [
        'apps/e2e/budget-planner-e2e/playwright.config.ts',
        'apps/e2e/budget-planner-e2e/src/example.spec.ts',
      ],
      {
        [APPLICATION_NAME_TOKEN]: 'budget-planner',
        [PORT_NUMBER_TOKEN]: '4200',
      },
    );

    expect(
      tree.read('apps/e2e/budget-planner-e2e/playwright.config.ts', 'utf-8'),
    ).toBe('port=4200');
    expect(
      tree.read('apps/e2e/budget-planner-e2e/src/example.spec.ts', 'utf-8'),
    ).toBe('name=budget-planner');
  });
});
