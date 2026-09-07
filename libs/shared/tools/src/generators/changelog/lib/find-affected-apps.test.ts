import { execCommand } from 'nx/src/command-line/release/utils/exec-command';
import * as fs from 'fs';

import {
  findAffectedApps,
  findConsumers,
  getChangedComponent,
  resolveImportAlias,
} from './find-affected-apps';

jest.mock('nx/src/command-line/release/utils/exec-command', () => ({
  execCommand: jest.fn(),
}));
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: jest.fn(),
}));

const execCommandMock = execCommand as jest.Mock;
const readFileSyncMock = fs.readFileSync as jest.Mock;

const TSCONFIG_WITH_PATHS = {
  compilerOptions: {
    paths: {
      '@maps-react/common/*': ['libs/shared/ui/src/*'],
      '@maps-react/core/*': ['libs/shared/core/src/*'],
      '@maps-react/hooks/*': ['libs/shared/hooks/src/*'],
    },
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  readFileSyncMock.mockReturnValue(JSON.stringify(TSCONFIG_WITH_PATHS));
});

describe('getChangedComponent', () => {
  it('parses a shared ui component file path', () => {
    expect(
      getChangedComponent('libs/shared/ui/src/components/Button/Button.tsx'),
    ).toEqual({ library: 'ui', importPath: 'components/Button' });
  });

  it('parses a nested shared component path', () => {
    expect(
      getChangedComponent('libs/shared/core/src/components/Header/Header.tsx'),
    ).toEqual({ library: 'core', importPath: 'components/Header' });
  });

  it('returns null for a file that does not match the pattern', () => {
    expect(
      getChangedComponent('apps/budget-planner/src/pages/index.tsx'),
    ).toBeNull();
  });

  it('returns null for a lib file without a component subfolder', () => {
    expect(getChangedComponent('libs/shared/ui/src/index.ts')).toBeNull();
  });
});

describe('resolveImportAlias', () => {
  it('resolves the alias for ui library', () => {
    expect(resolveImportAlias('ui')).toBe('@maps-react/common');
  });

  it('resolves the alias for core library', () => {
    expect(resolveImportAlias('core')).toBe('@maps-react/core');
  });

  it('returns null when no alias exists for the library', () => {
    expect(resolveImportAlias('nonexistent')).toBeNull();
  });
});

describe('findConsumers', () => {
  it('returns files that import the component', async () => {
    execCommandMock.mockResolvedValue(
      'apps/budget-planner/src/pages/index.tsx\nlibs/shared/core/src/components/Header/Header.tsx\n',
    );

    const result = await findConsumers({
      library: 'ui',
      importPath: 'components/Button',
    });

    expect(execCommandMock).toHaveBeenCalledWith('git', [
      'grep',
      '-l',
      '@maps-react/common/components/Button',
      '--',
      'apps',
      'libs',
    ]);
    expect(result).toEqual([
      'apps/budget-planner/src/pages/index.tsx',
      'libs/shared/core/src/components/Header/Header.tsx',
    ]);
  });

  it('returns empty array when no consumers are found', async () => {
    execCommandMock.mockRejectedValue(new Error('exit code 1'));

    const result = await findConsumers({
      library: 'ui',
      importPath: 'components/Button',
    });

    expect(result).toEqual([]);
  });

  it('returns empty array when alias cannot be resolved', async () => {
    const result = await findConsumers({
      library: 'nonexistent',
      importPath: 'components/Foo',
    });

    expect(execCommandMock).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});

describe('findAffectedApps', () => {
  it('returns the app that directly imports the changed component', async () => {
    execCommandMock.mockResolvedValue(
      'apps/budget-planner/src/pages/index.tsx\n',
    );

    const result = await findAffectedApps({
      library: 'ui',
      importPath: 'components/Button',
    });

    expect(result).toEqual(['budget-planner']);
  });

  it('returns no apps when no consumer imports the changed component', async () => {
    execCommandMock.mockRejectedValue(new Error('exit code 1'));

    const result = await findAffectedApps({
      library: 'ui',
      importPath: 'components/Button',
    });

    expect(result).toEqual([]);
  });

  it('resolves transitive dependency: lib consumes component and app consumes lib', async () => {
    // First call: Button is consumed by Header (a lib)
    // Second call: Header is consumed by budget-planner (an app)
    execCommandMock
      .mockResolvedValueOnce(
        'libs/shared/core/src/components/Header/Header.tsx\n',
      )
      .mockResolvedValueOnce('apps/budget-planner/src/pages/index.tsx\n');

    const result = await findAffectedApps({
      library: 'ui',
      importPath: 'components/Button',
    });

    expect(result).toEqual(['budget-planner']);
    expect(execCommandMock).toHaveBeenCalledTimes(2);
  });

  it('does not re-visit already visited components to prevent infinite loops', async () => {
    // Simulate a cycle: ComponentA imports ComponentB, ComponentB imports ComponentA
    execCommandMock
      .mockResolvedValueOnce(
        'libs/shared/ui/src/components/ComponentB/ComponentB.tsx\n',
      )
      .mockResolvedValueOnce(
        'libs/shared/ui/src/components/ComponentA/ComponentA.tsx\n',
      );

    const result = await findAffectedApps({
      library: 'ui',
      importPath: 'components/ComponentA',
    });

    // No app found but should terminate without infinite recursion
    expect(result).toEqual([]);
    expect(execCommandMock).toHaveBeenCalledTimes(2);
  });

  it('deduplicates apps when multiple components point to the same app', async () => {
    execCommandMock.mockResolvedValue(
      'apps/budget-planner/src/pages/index.tsx\nlibs/shared/core/src/components/Header/Header.tsx\n',
    );

    const result = await findAffectedApps({
      library: 'ui',
      importPath: 'components/Button',
    });

    expect(result).toEqual(['budget-planner']);
  });

  it('resolves wildcard alias when barrel alias exists before it', () => {
    readFileSyncMock.mockReturnValue(
      JSON.stringify({
        compilerOptions: {
          paths: {
            '@maps-digital/shared/ui': ['libs/shared/ui/src/index.ts'],

            '@maps-react/common/*': ['libs/shared/ui/src/*'],

            '@maps-react/core/*': ['libs/shared/core/src/*'],
          },
        },
      }),
    );

    expect(resolveImportAlias('ui')).toBe('@maps-react/common');
  });

  it('resolves the correct wildcard alias for each shared library', () => {
    readFileSyncMock.mockReturnValue(
      JSON.stringify({
        compilerOptions: {
          paths: {
            '@maps-digital/shared/ui': ['libs/shared/ui/src/index.ts'],
            '@maps-react/common/*': ['libs/shared/ui/src/*'],
            '@maps-react/form/*': ['libs/shared/form/src/*'],
            '@maps-react/core/*': ['libs/shared/core/src/*'],
          },
        },
      }),
    );

    expect(resolveImportAlias('ui')).toBe('@maps-react/common');
    expect(resolveImportAlias('form')).toBe('@maps-react/form');
    expect(resolveImportAlias('core')).toBe('@maps-react/core');
  });
});
