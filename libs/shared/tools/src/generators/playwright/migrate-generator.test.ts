import { logger } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import migratePlaywrightGenerator from './migrate-generator';

jest.mock('@nx/devkit', () => ({
  ...jest.requireActual('@nx/devkit'),
  formatFiles: jest.fn().mockResolvedValue(undefined),
}));

jest.spyOn(logger, 'warn').mockImplementation(() => undefined);

describe('playwright migrate generator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('archives an existing Cypress E2E project folder', async () => {
    const tree = createTreeWithEmptyWorkspace();

    tree.write(
      'apps/budget-planner/project.json',
      JSON.stringify(
        {
          name: 'budget-planner',
          targets: {
            serve: { options: { port: 4200 } },
          },
        },
        null,
        2,
      ),
    );

    tree.write(
      'apps/e2e/budget-planner-e2e/project.json',
      JSON.stringify({ name: 'budget-planner-e2e' }, null, 2),
    );
    tree.write('apps/e2e/budget-planner-e2e/cypress.config.ts', 'export {}');
    tree.write('apps/e2e/budget-planner-e2e/src/test.ts', 'test');

    await migratePlaywrightGenerator(tree, {
      application: 'budget-planner',
    } as never);

    expect(
      tree.exists(
        'apps/e2e/budget-planner-e2e/archived-cypress/project.old.json',
      ),
    ).toBe(true);
    expect(tree.exists('apps/e2e/budget-planner-e2e/project.json')).toBe(true);
    expect(
      tree.exists('apps/e2e/budget-planner-e2e/archived-cypress/src/test.ts'),
    ).toBe(true);
    expect(tree.exists('apps/e2e/budget-planner-e2e/cypress.config.ts')).toBe(
      false,
    );
  });

  it('throws when no application name is provided', async () => {
    const tree = createTreeWithEmptyWorkspace();

    await expect(
      migratePlaywrightGenerator(tree, { application: '' } as never),
    ).rejects.toThrow('An application name is required.');
  });

  it('throws when the existing project is already migrated', async () => {
    const tree = createTreeWithEmptyWorkspace();

    tree.write(
      'apps/budget-planner/project.json',
      JSON.stringify(
        {
          name: 'budget-planner',
          targets: { serve: { options: { port: 4200 } } },
        },
        null,
        2,
      ),
    );
    tree.write(
      'apps/e2e/budget-planner-e2e/project.json',
      JSON.stringify({ name: 'budget-planner-e2e' }, null, 2),
    );
    tree.write('apps/e2e/budget-planner-e2e/cypress.config.ts', 'export {}');
    tree.write('apps/e2e/budget-planner-e2e/playwright.config.ts', 'export {}');

    await expect(
      migratePlaywrightGenerator(tree, {
        application: 'budget-planner',
      } as never),
    ).rejects.toThrow(
      'The E2E project already looks migrated: apps/e2e/budget-planner-e2e/playwright.config.ts',
    );
  });

  it('throws when the target app project is missing', async () => {
    const tree = createTreeWithEmptyWorkspace();

    tree.write(
      'apps/e2e/budget-planner-e2e/project.json',
      JSON.stringify({ name: 'budget-planner-e2e' }, null, 2),
    );
    tree.write('apps/e2e/budget-planner-e2e/cypress.config.ts', 'export {}');

    await expect(
      migratePlaywrightGenerator(tree, {
        application: 'budget-planner',
      } as never),
    ).rejects.toThrow(
      'The app project does not exist: apps/budget-planner/project.json',
    );
  });
});
