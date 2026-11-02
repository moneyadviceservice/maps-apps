import { logger, ProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import {
  assertValidAppName,
  collectUsedPorts,
  copySharedPublicAssets,
  pickFreePort,
  renderNextSteps,
  resolvePort,
  SHARED_PUBLIC_ASSETS,
  toJobId,
  toTitle,
  validateSiteId,
  warnOnOverlappingNames,
} from './utils';

jest.spyOn(logger, 'warn').mockImplementation(() => undefined);

describe('assertValidAppName', () => {
  it.each(['example-tool', 'tool', 'tool2', 'a-b-c', 'tool-2'])(
    'accepts %s',
    (name) => {
      expect(() => assertValidAppName(name)).not.toThrow();
    },
  );

  it.each([
    '',
    'Foo',
    'foo_bar',
    '-foo',
    'foo-',
    'foo--bar',
    'apps/foo',
    '2foo',
  ])('rejects "%s" as not kebab-case', (name) => {
    expect(() => assertValidAppName(name)).toThrow(
      `Invalid app name "${name}": use kebab-case (lowercase letters, digits, single hyphens), e.g. "example-tool".`,
    );
  });

  it.each(['e2e', 'foo-e2e'])('rejects the reserved name %s', (name) => {
    expect(() => assertValidAppName(name)).toThrow(
      'names ending in "-e2e" are reserved',
    );
  });
});

describe('toTitle and toJobId', () => {
  it('title-cases a kebab-case name', () => {
    expect(toTitle('example-tool')).toBe('Example Tool');
    expect(toTitle('tool')).toBe('Tool');
  });

  it('builds the pipeline job id', () => {
    expect(toJobId('example-tool')).toBe('example_tool');
  });
});

describe('validateSiteId', () => {
  it('accepts an empty value and a lowercase uuid', () => {
    expect(validateSiteId(undefined)).toBeUndefined();
    expect(validateSiteId('')).toBeUndefined();
    expect(validateSiteId('f6cbe253-9083-4d34-bd91-b80632080494')).toBe(
      'f6cbe253-9083-4d34-bd91-b80632080494',
    );
  });

  it('rejects anything else', () => {
    expect(() => validateSiteId('my-site')).toThrow(
      'Invalid --netlifySiteId "my-site": expected a Netlify site id UUID',
    );
  });
});

describe('warnOnOverlappingNames', () => {
  beforeEach(() => jest.clearAllMocks());

  it('warns when another project name contains or is contained in the name', () => {
    warnOnOverlappingNames('pension', [
      'pension-calculator',
      'budget-planner',
      'pension-e2e',
    ]);

    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        '"pension" overlaps with the existing project "pension-calculator"',
      ),
    );
  });

  it('stays quiet otherwise', () => {
    warnOnOverlappingNames('savings-goal', ['budget-planner']);

    expect(logger.warn).not.toHaveBeenCalled();
  });
});

describe('ports', () => {
  const projects = new Map<string, ProjectConfiguration>([
    [
      'budget-planner',
      {
        root: 'apps/budget-planner',
        targets: { serve: { options: { port: 4350 } } },
      },
    ],
    [
      'credit-rejection',
      {
        root: 'apps/credit-rejection',
        targets: { serve: { options: { port: 4350 } }, build: {} },
      },
    ],
    [
      'tools-index-e2e',
      {
        root: 'apps/e2e/tools-index-e2e',
        targets: {
          e2e: { options: { port: 4301 } },
          'e2e-headed': { options: { port: 4301 } },
        },
      },
    ],
    ['shared-ui', { root: 'libs/shared/ui' }],
  ]);

  it('collects the ports of every target and netlify.toml, once per project', () => {
    const tree = createTreeWithEmptyWorkspace();
    tree.write(
      'apps/pensionwise-triage/netlify.toml',
      '[dev]\n    targetPort = 4302\n',
    );
    tree.write(
      'apps/budget-planner/netlify.toml',
      '[dev]\n    targetPort = 4350\n',
    );
    tree.write('apps/no-toml/project.json', '{}');

    const usedPorts = collectUsedPorts(tree, projects);

    expect(usedPorts.get(4350)).toEqual([
      'budget-planner (apps/budget-planner/project.json targets.serve)',
      'credit-rejection (apps/credit-rejection/project.json targets.serve)',
    ]);
    expect(usedPorts.get(4301)).toEqual([
      'tools-index-e2e (apps/e2e/tools-index-e2e/project.json targets.e2e)',
    ]);
    expect(usedPorts.get(4302)).toEqual([
      'pensionwise-triage (apps/pensionwise-triage/netlify.toml)',
    ]);
    expect(usedPorts.size).toBe(3);
  });

  it('picks the lowest unused port from 4300', () => {
    const usedPorts = new Map([
      [4300, ['a']],
      [4301, ['b']],
      [4303, ['c']],
    ]);

    expect(pickFreePort(usedPorts)).toBe(4302);
    expect(pickFreePort(new Map())).toBe(4300);
  });

  it('resolves an explicit free port', () => {
    expect(resolvePort(4400, new Map([[4350, ['a']]]))).toBe(4400);
  });

  it('rejects an explicit port that is in use or out of range', () => {
    const usedPorts = new Map([
      [4350, ['budget-planner (x)', 'credit-rejection (y)']],
    ]);

    expect(() => resolvePort(4350, usedPorts)).toThrow(
      'Port 4350 is already used by budget-planner (x), credit-rejection (y). Pick another --port or omit it to use the next free port.',
    );
    expect(() => resolvePort(80, usedPorts)).toThrow(
      'Invalid --port "80": use an integer between 1024 and 65535.',
    );
    expect(() => resolvePort(4300.5, usedPorts)).toThrow('Invalid --port');
  });
});

describe('copySharedPublicAssets', () => {
  beforeEach(() => jest.clearAllMocks());

  it('copies the shared assets byte for byte', () => {
    const tree = createTreeWithEmptyWorkspace();
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0xff]);
    tree.write('libs/shared/ui/src/public/maps-logo.png', png);
    for (const asset of SHARED_PUBLIC_ASSETS.slice(1)) {
      tree.write(`libs/shared/ui/src/public/${asset}`, asset);
    }

    const manualSteps = copySharedPublicAssets(tree, 'example-tool');

    expect(manualSteps).toEqual([]);
    expect(
      tree.read('apps/example-tool/public/maps-logo.png')?.equals(png),
    ).toBe(true);
    expect(
      tree.read('apps/example-tool/public/footer/gov-cy.svg', 'utf-8'),
    ).toBe('footer/gov-cy.svg');
  });

  it('warns and lists a manual step for a missing asset', () => {
    const tree = createTreeWithEmptyWorkspace();

    const manualSteps = copySharedPublicAssets(tree, 'example-tool');

    expect(manualSteps).toHaveLength(SHARED_PUBLIC_ASSETS.length);
    expect(manualSteps[0]).toBe(
      'Copy maps-logo.png from another app into apps/example-tool/public',
    );
    expect(logger.warn).toHaveBeenCalledTimes(SHARED_PUBLIC_ASSETS.length);
  });
});

describe('renderNextSteps', () => {
  it('lists the site id files when no id was given', () => {
    const steps = renderNextSteps({
      name: 'example-tool',
      port: 4301,
      e2e: true,
      manualSteps: ['Do the thing'],
    });

    expect(steps).toContain('1. npx nx reset');
    expect(steps).toContain('http://localhost:4301/en');
    expect(steps).toContain(
      'netlify/scripts/sites.py           "example-tool": "<site id>",',
    );
    expect(steps).not.toContain('e2e-generate');
    expect(steps).toContain('7. Do the thing');
  });

  it('points at NETLIFY_ENV_FILTER when an id was given and e2e was skipped', () => {
    const steps = renderNextSteps({
      name: 'example-tool',
      port: 4301,
      e2e: false,
      netlifySiteId: 'f6cbe253-9083-4d34-bd91-b80632080494',
      manualSteps: [],
    });

    expect(steps).toContain('change NETLIFY_ENV_FILTER');
    expect(steps).not.toContain('<site id>');
    expect(steps).toContain(
      'npx nx g @maps-react/tools:e2e-generate example-tool',
    );
  });
});
