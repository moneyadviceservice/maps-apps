import { execCommand } from 'nx/src/command-line/release/utils/exec-command';
import {
  getCommitHash,
  getFirstGitCommit,
} from 'nx/src/command-line/release/utils/git';

import { resolveFromRef } from './resolve-from-ref';

jest.mock('nx/src/command-line/release/utils/exec-command', () => ({
  execCommand: jest.fn(),
}));
jest.mock('nx/src/command-line/release/utils/git', () => ({
  getCommitHash: jest.fn(),
  getFirstGitCommit: jest.fn(),
}));

const execCommandMock = execCommand as jest.Mock;
const getCommitHashMock = getCommitHash as jest.Mock;
const getFirstGitCommitMock = getFirstGitCommit as jest.Mock;

const APP_ROOT = 'apps/mortgage-calculator';

/** Route the two `git log` calls by inspecting their args. */
function mockGitLog({
  release = '',
  changelog = '',
}: {
  release?: string;
  changelog?: string;
}) {
  execCommandMock.mockImplementation(async (_cmd: string, args: string[]) =>
    args.some((arg) => arg.startsWith('--grep')) ? release : changelog,
  );
}

describe('resolveFromRef', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getCommitHashMock.mockImplementation(
      async (ref: string) => `sha-of-${ref}`,
    );
    getFirstGitCommitMock.mockResolvedValue('first-commit-sha');
  });

  it('resolves an explicit override without consulting git history', async () => {
    const result = await resolveFromRef(
      'mortgage-calculator',
      APP_ROOT,
      'v1.0.0',
    );

    expect(result).toBe('sha-of-v1.0.0');
    expect(execCommandMock).not.toHaveBeenCalled();
    expect(getFirstGitCommitMock).not.toHaveBeenCalled();
  });

  it('uses the last chore(release) commit that touched the CHANGELOG', async () => {
    mockGitLog({ release: 'release-sha\n' });

    const result = await resolveFromRef('mortgage-calculator', APP_ROOT);

    expect(execCommandMock).toHaveBeenCalledWith('git', [
      'log',
      '-n',
      '1',
      '--format=%H',
      '--grep=^chore(release): mortgage-calculator ',
      '--',
      'apps/mortgage-calculator/CHANGELOG.md',
    ]);
    // A git log SHA is canonical, so it is returned as-is, not re-resolved.
    expect(getCommitHashMock).not.toHaveBeenCalled();
    expect(result).toBe('release-sha');
    expect(getFirstGitCommitMock).not.toHaveBeenCalled();
  });

  it('falls back to the last CHANGELOG commit when there is no release marker', async () => {
    mockGitLog({ release: '', changelog: 'changelog-sha\n' });

    const result = await resolveFromRef('mortgage-calculator', APP_ROOT);

    expect(execCommandMock).toHaveBeenCalledWith('git', [
      'log',
      '-n',
      '1',
      '--format=%H',
      '--',
      'apps/mortgage-calculator/CHANGELOG.md',
    ]);
    expect(result).toBe('changelog-sha');
    expect(getFirstGitCommitMock).not.toHaveBeenCalled();
  });

  it('falls back to the first commit for a first release', async () => {
    mockGitLog({ release: '\n', changelog: '\n' });

    const result = await resolveFromRef('mortgage-calculator', APP_ROOT);

    expect(result).toBe('first-commit-sha');
    expect(getFirstGitCommitMock).toHaveBeenCalled();
  });

  it('falls back to the first commit when git log fails', async () => {
    execCommandMock.mockRejectedValue(new Error('no git'));

    const result = await resolveFromRef('mortgage-calculator', APP_ROOT);

    expect(result).toBe('first-commit-sha');
  });

  it('never reads tags (the boundary must be reachable from HEAD)', async () => {
    // No release marker, so both `git log` lookups run.
    mockGitLog({ release: '', changelog: 'changelog-sha\n' });

    await resolveFromRef('mortgage-calculator', APP_ROOT);

    expect(execCommandMock).toHaveBeenCalledTimes(2);
    for (const call of execCommandMock.mock.calls) {
      expect(call[1][0]).toBe('log');
    }
  });
});
