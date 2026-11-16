import { formatFiles, logger } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import playwrightGenerator from './generator';

jest.mock('@nx/devkit', () => ({
  ...jest.requireActual('@nx/devkit'),
  formatFiles: jest.fn().mockResolvedValue(undefined),
}));

jest.spyOn(logger, 'warn').mockImplementation(() => undefined);

describe('playwright generator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates an e2e project for an existing application', async () => {
    const tree = createTreeWithEmptyWorkspace();

    tree.write(
      'apps/budget-planner/project.json',
      JSON.stringify(
        {
          targets: {
            serve: {
              options: {
                port: 4200,
              },
            },
          },
        },
        null,
        2,
      ),
    );

    await playwrightGenerator(tree, { application: 'budget-planner' } as never);

    expect(tree.exists('apps/e2e/budget-planner-e2e/project.json')).toBe(true);

    expect(
      tree.exists('apps/e2e/budget-planner-e2e/src/tests/example.spec.ts'),
    ).toBe(true);

    const projectJson = tree.read(
      'apps/e2e/budget-planner-e2e/project.json',
      'utf-8',
    ) as string;
    const targetAppProjectJson = tree.read(
      'apps/budget-planner/project.json',
      'utf-8',
    ) as string;

    const playwrightConfig = tree.read(
      'apps/e2e/budget-planner-e2e/playwright.config.ts',
      'utf-8',
    ) as string;

    expect(projectJson).toContain('budget-planner-e2e');
    expect(playwrightConfig).toContain('4200');
    expect(targetAppProjectJson).not.toContain('budget-planner-e2e');
    expect(targetAppProjectJson).not.toContain('"implicitDependencies"');
    expect(formatFiles).toHaveBeenCalled();
  });

  it('throws when no application name is provided', async () => {
    const tree = createTreeWithEmptyWorkspace();

    await expect(
      playwrightGenerator(tree, { application: '' } as never),
    ).rejects.toThrow('An application name is required.');
  });

  it('throws when the project has no port number configured', async () => {
    const tree = createTreeWithEmptyWorkspace();
    tree.write('apps/budget-planner/project.json', '{}');

    await expect(
      playwrightGenerator(tree, { application: 'budget-planner' } as never),
    ).rejects.toThrow(
      'apps/budget-planner/project.json does not contain a port number under targets.serve.options.port',
    );
  });
});
