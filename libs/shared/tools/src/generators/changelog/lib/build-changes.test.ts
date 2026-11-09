import { buildChanges } from './build-changes';

import {
  getGitDiff,
  parseCommits,
} from 'nx/src/command-line/release/utils/git';

import { mapCommitToChange } from 'nx/src/command-line/release/changelog/commit-utils';

import { getChangedComponent, findAffectedApps } from './find-affected-apps';

jest.mock('nx/src/command-line/release/utils/git');
jest.mock('nx/src/command-line/release/changelog/commit-utils');
jest.mock('./find-affected-apps');

const mockedGetGitDiff = jest.mocked(getGitDiff);
const mockedParseCommits = jest.mocked(parseCommits);
const mockedMapCommitToChange = jest.mocked(mapCommitToChange);

const mockedGetChangedComponent = jest.mocked(getChangedComponent);
const mockedFindAffectedApps = jest.mocked(findAffectedApps);

describe('buildChanges', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedGetGitDiff.mockResolvedValue([] as any);
    mockedParseCommits.mockReturnValue([]);

    mockedGetChangedComponent.mockReturnValue(null);
    mockedFindAffectedApps.mockResolvedValue([]);
  });

  it('returns changelog entries for direct app changes', async () => {
    mockedParseCommits.mockReturnValue([
      {
        affectedFiles: ['apps/my-app/src/page.tsx'],
      } as any,
    ]);

    mockedMapCommitToChange.mockReturnValue({
      type: 'feat',
      title: 'new feature',
    } as any);

    const result = await buildChanges('apps/my-app', 'abc123');

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('feat');

    expect(mockedFindAffectedApps).not.toHaveBeenCalled();
  });

  it('returns changes when a shared component affects the app', async () => {
    mockedParseCommits.mockReturnValue([
      {
        affectedFiles: ['libs/shared/components/Button.tsx'],
      } as any,
    ]);

    mockedGetChangedComponent.mockReturnValue({
      name: 'Button',
      library: 'shared',
    } as any);

    mockedFindAffectedApps.mockResolvedValue(['my-app']);

    mockedMapCommitToChange.mockReturnValue({
      type: 'fix',
      title: 'button fix',
    } as any);

    const result = await buildChanges('apps/my-app', 'abc123');

    expect(result).toHaveLength(1);

    expect(mockedFindAffectedApps).toHaveBeenCalledWith({
      name: 'Button',
      library: 'shared',
    });
  });

  it('ignores test files', async () => {
    mockedParseCommits.mockReturnValue([
      {
        affectedFiles: ['apps/my-app/src/Button.spec.tsx'],
      } as any,
    ]);

    const result = await buildChanges('apps/my-app', 'abc123');

    expect(result).toEqual([]);

    expect(mockedMapCommitToChange).not.toHaveBeenCalled();
  });

  it('returns empty array when app is unaffected', async () => {
    mockedParseCommits.mockReturnValue([
      {
        affectedFiles: ['apps/another-app/src/page.tsx'],
      } as any,
    ]);

    const result = await buildChanges('apps/my-app', 'abc123');

    expect(result).toEqual([]);
  });

  it('filters invalid changelog entries', async () => {
    mockedParseCommits.mockReturnValue([
      {
        affectedFiles: ['apps/my-app/src/page.tsx'],
      } as any,
    ]);

    mockedMapCommitToChange.mockReturnValue({
      type: '__INVALID__',
    } as any);

    const result = await buildChanges('apps/my-app', 'abc123');

    expect(result).toEqual([]);
  });

  it('ignores unrelated app commits when the app has other changes', async () => {
    mockedParseCommits.mockReturnValue([
      {
        affectedFiles: ['apps/another-app/src/page.tsx'],
      } as any,
      {
        affectedFiles: ['apps/my-app/src/page.tsx'],
      } as any,
    ]);

    mockedMapCommitToChange.mockReturnValue({
      type: 'feat',
    } as any);

    const result = await buildChanges('apps/my-app', 'abc123');

    expect(result).toHaveLength(1);
    expect(mockedMapCommitToChange).toHaveBeenCalledTimes(1);
  });

  describe('category', () => {
    beforeEach(() => {
      // Every shared component reaches my-app, so inclusion is never in question.
      mockedGetChangedComponent.mockReturnValue({
        library: 'ui',
        importPath: 'Button',
      });
      mockedFindAffectedApps.mockResolvedValue(['my-app']);
      mockedMapCommitToChange.mockReturnValue({ type: 'feat' } as any);
    });

    it.each([
      {
        category: 'app',
        when: 'scoped to the app',
        scope: 'my-app',
        affectedFiles: ['libs/shared/ui/src/Button.tsx'],
      },
      {
        category: 'app',
        when: 'unscoped and touching the app folder',
        scope: '',
        affectedFiles: [
          'apps/my-app/src/page.tsx',
          'libs/shared/ui/src/Button.tsx',
        ],
      },
      {
        category: 'monorepo',
        when: 'scoped to another app, even when it touches the app folder',
        scope: 'other-app',
        affectedFiles: ['apps/my-app/src/page.tsx'],
      },
      {
        category: 'monorepo',
        when: 'from a shared library the app imports',
        scope: 'shared-ui',
        affectedFiles: ['libs/shared/ui/src/Button.tsx'],
      },
      {
        category: 'monorepo',
        when: 'unscoped and touching only test files in the app folder',
        scope: '',
        affectedFiles: [
          'apps/my-app/src/page.test.tsx',
          'libs/shared/ui/src/Button.tsx',
        ],
      },
    ])(
      'is $category for a commit $when',
      async ({ category, scope, affectedFiles }) => {
        mockedParseCommits.mockReturnValue([{ scope, affectedFiles } as any]);

        const result = await buildChanges('apps/my-app', 'abc123');

        expect(result).toEqual([expect.objectContaining({ category })]);
      },
    );
  });
});
