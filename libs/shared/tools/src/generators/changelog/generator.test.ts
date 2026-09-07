import { execCommand } from 'nx/src/command-line/release/utils/exec-command';
import * as git from 'nx/src/command-line/release/utils/git';
import { createProjectGraphAsync } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import changelogGenerator from './generator';

jest.mock('@nx/devkit', () => ({
  ...jest.requireActual('@nx/devkit'),
  createProjectGraphAsync: jest.fn(),
  formatFiles: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('nx/src/command-line/release/utils/exec-command', () => ({
  execCommand: jest.fn(),
}));
jest.mock('nx/src/command-line/release/utils/git', () => ({
  getGitDiff: jest.fn(),
  parseCommits: jest.fn(),
  getCommitHash: jest.fn(),
  getFirstGitCommit: jest.fn(),
  gitAdd: jest.fn(),
  gitCommit: jest.fn(),
  gitTag: jest.fn(),
}));

const FILES = {
  app: 'apps/mortgage-calculator/pages/index.tsx',
  // A commit outside the app's folder: not an app change.
  lib: 'libs/shared/ui/src/Button.tsx',
};

const GRAPH = {
  nodes: {
    'mortgage-calculator': {
      name: 'mortgage-calculator',
      type: 'app',
      data: { root: 'apps/mortgage-calculator', projectType: 'application' },
    },
    'shared-ui': {
      name: 'shared-ui',
      type: 'lib',
      data: { root: 'libs/shared/ui', projectType: 'library' },
    },
  },
  dependencies: {},
};

function commit(overrides: Record<string, unknown>) {
  return {
    message: '',
    body: '',
    shortHash: 'aaaaaaa',
    author: { name: 'Dev', email: 'dev@example.com' },
    authors: [{ name: 'Dev', email: 'dev@example.com' }],
    type: 'feat',
    scope: '',
    description: 'a change',
    isBreaking: false,
    references: [],
    revertedHashes: [],
    affectedFiles: [] as string[],
    ...overrides,
  };
}

const CHANGELOG_PATH = 'apps/mortgage-calculator/CHANGELOG.md';

function setCommits(commits: ReturnType<typeof commit>[]) {
  (git.parseCommits as jest.Mock).mockReturnValue(commits);
}

describe('changelog generator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (createProjectGraphAsync as jest.Mock).mockResolvedValue(GRAPH);
    (execCommand as jest.Mock).mockResolvedValue('baseline-sha\n');
    (git.getGitDiff as jest.Mock).mockResolvedValue([]);
    (git.parseCommits as jest.Mock).mockReturnValue([]);
    (git.getCommitHash as jest.Mock).mockImplementation(
      async (ref: string) => `full-${ref}`,
    );
    (git.getFirstGitCommit as jest.Mock).mockResolvedValue('first-commit');
    (git.gitAdd as jest.Mock).mockResolvedValue(undefined);
    (git.gitCommit as jest.Mock).mockResolvedValue(undefined);
  });

  function run(options: Record<string, unknown> = {}) {
    const tree = createTreeWithEmptyWorkspace();
    const result = changelogGenerator(tree, {
      project: 'mortgage-calculator',
      releaseVersion: '0.2.0',
      ...options,
    } as never);
    return { tree, result };
  }

  it('renders an app change as a normal entry with a full-hash commit link', async () => {
    setCommits([
      commit({
        shortHash: 'app0001',
        type: 'fix',
        scope: 'mortgage-calculator',
        description: 'fix copy',
        affectedFiles: [FILES.app],
      }),
    ]);

    const { tree, result } = run();
    await result;

    const md = tree.read(CHANGELOG_PATH, 'utf-8') as string;
    expect(md).toContain('fix copy');
    // The short hash is resolved to its full hash for the commit link.
    expect(md).toContain('/commit/full-app0001');
  });

  it('keeps every conventional type, e.g. chore alongside feat', async () => {
    setCommits([
      commit({
        shortHash: 'chore01',
        type: 'chore',
        scope: 'mortgage-calculator',
        description: 'tidy up',
        affectedFiles: [FILES.app],
      }),
      commit({
        shortHash: 'feat001',
        type: 'feat',
        scope: 'mortgage-calculator',
        description: 'shiny feature',
        affectedFiles: [FILES.app],
      }),
    ]);

    const { tree, result } = run();
    await result;

    const md = tree.read(CHANGELOG_PATH, 'utf-8') as string;
    expect(md).toContain('shiny feature');
    // chore is no longer dropped; it renders under its own section.
    expect(md).toContain('tidy up');
    expect(md).toContain('🏡 Chore');
  });

  it('skips non-conventional commits (Nx types them __INVALID__)', async () => {
    setCommits([
      commit({
        shortHash: 'merge01',
        type: '__INVALID__',
        scope: '',
        description: 'Merge branch main',
        affectedFiles: [FILES.app],
      }),
    ]);

    const { tree, result } = run();
    await result;

    // Nothing changelog-worthy remains, so no file is written.
    expect(tree.exists(CHANGELOG_PATH)).toBe(false);
  });

  it('ignores commits outside the app folder (writes nothing)', async () => {
    // A commit that never touched apps/mortgage-calculator/** is not an app
    // change, so there is nothing to write.
    setCommits([
      commit({
        shortHash: 'libonly1',
        type: 'feat',
        scope: 'ui',
        description: 'shared change',
        affectedFiles: [FILES.lib],
      }),
    ]);

    const { tree, result } = run();
    await result;

    expect(tree.exists(CHANGELOG_PATH)).toBe(false);
  });

  it('links only the work items in the "Related work items" trailer', async () => {
    setCommits([
      commit({
        shortHash: 'wi00001',
        type: 'fix',
        scope: 'mortgage-calculator',
        // Neither the 5-digit subject number nor the stray body #ref is a work
        // item: only ids on the trailer are linked.
        description: 'reduce timeout to 30000',
        body: 'Fixes upstream #936.\n\nRelated work items: #51888',
        affectedFiles: [FILES.app],
      }),
    ]);

    const { tree, result } = run();
    await result;

    const md = tree.read(CHANGELOG_PATH, 'utf-8') as string;
    expect(md).toContain('[#51888](');
    expect(md).toContain('/_workitems/edit/51888');
    expect(md).not.toContain('/_workitems/edit/30000');
    expect(md).not.toContain('/_workitems/edit/936');
  });

  it('links multiple work items from one trailer', async () => {
    setCommits([
      commit({
        shortHash: 'wi00002',
        type: 'feat',
        scope: 'mortgage-calculator',
        description: 'two work items',
        body: 'Related work items: #50894, #50895',
        affectedFiles: [FILES.app],
      }),
    ]);

    const { tree, result } = run();
    await result;

    const md = tree.read(CHANGELOG_PATH, 'utf-8') as string;
    expect(md).toContain('/_workitems/edit/50894');
    expect(md).toContain('/_workitems/edit/50895');
  });

  it('inserts the new entry below the H1 and above older versions', async () => {
    setCommits([
      commit({
        shortHash: 'new0001',
        type: 'feat',
        scope: 'mortgage-calculator',
        description: 'brand new',
        affectedFiles: [FILES.app],
      }),
    ]);

    const tree = createTreeWithEmptyWorkspace();
    tree.write(
      CHANGELOG_PATH,
      '# Changelog\n\n## 0.1.0 (2025-01-01)\n\n### Features\n\n- old thing\n',
    );

    await changelogGenerator(tree, {
      project: 'mortgage-calculator',
      releaseVersion: '0.2.0',
    } as never);

    const md = tree.read(CHANGELOG_PATH, 'utf-8') as string;
    expect(md.match(/# Changelog/g) ?? []).toHaveLength(1);
    expect(md.indexOf('## 0.2.0')).toBeGreaterThan(md.indexOf('# Changelog'));
    expect(md.indexOf('## 0.2.0')).toBeLessThan(md.indexOf('## 0.1.0'));
    expect(md).toContain('old thing');
  });

  it('creates the file with an H1 when none exists', async () => {
    setCommits([
      commit({
        shortHash: 'first01',
        type: 'feat',
        scope: 'mortgage-calculator',
        description: 'first feature',
        affectedFiles: [FILES.app],
      }),
    ]);

    const { tree, result } = run();
    await result;

    const md = tree.read(CHANGELOG_PATH, 'utf-8') as string;
    expect(md.startsWith('# Changelog')).toBe(true);
  });

  it('commits via the returned callback when --commit is set (no tag)', async () => {
    setCommits([
      commit({
        type: 'feat',
        scope: 'mortgage-calculator',
        description: 'a feature',
        affectedFiles: [FILES.app],
      }),
    ]);

    const { result } = run({ commit: true });
    const callback = (await result) as () => Promise<void>;
    expect(typeof callback).toBe('function');

    await callback();

    expect(git.gitAdd).toHaveBeenCalledWith({ changedFiles: [CHANGELOG_PATH] });
    // The commit is scoped to the changelog path so unrelated staged files
    // aren't swept into the release marker.
    expect(git.gitCommit).toHaveBeenCalledWith({
      messages: ['chore(release): mortgage-calculator 0.2.0'],
      additionalArgs: ['--', CHANGELOG_PATH],
    });
    // Tagging was removed: a release is a plain commit Netlify can deploy.
    expect(git.gitTag).not.toHaveBeenCalled();

    const addOrder = (git.gitAdd as jest.Mock).mock.invocationCallOrder[0];
    const commitOrder = (git.gitCommit as jest.Mock).mock
      .invocationCallOrder[0];
    expect(addOrder).toBeLessThan(commitOrder);
  });

  it('writes the changelog but does not commit by default', async () => {
    setCommits([
      commit({
        type: 'feat',
        scope: 'mortgage-calculator',
        description: 'a feature',
        affectedFiles: [FILES.app],
      }),
    ]);

    const { tree, result } = run();
    const callback = await result;

    // No callback means Nx runs no post-generation git side effects.
    expect(callback).toBeUndefined();
    expect(tree.exists(CHANGELOG_PATH)).toBe(true);
    expect(git.gitAdd).not.toHaveBeenCalled();
    expect(git.gitCommit).not.toHaveBeenCalled();
  });

  it('writes nothing and runs no git commands on a preview run', async () => {
    setCommits([
      commit({
        type: 'feat',
        scope: 'mortgage-calculator',
        description: 'a feature',
        affectedFiles: [FILES.app],
      }),
    ]);

    const { tree, result } = run({ preview: true });
    const callback = await result;

    expect(callback).toBeUndefined();
    expect(tree.exists(CHANGELOG_PATH)).toBe(false);
    expect(git.gitAdd).not.toHaveBeenCalled();
  });

  it('uses the first commit as the boundary for a first release', async () => {
    (execCommand as jest.Mock).mockResolvedValue('');
    setCommits([
      commit({
        type: 'feat',
        scope: 'mortgage-calculator',
        description: 'a feature',
        affectedFiles: [FILES.app],
      }),
    ]);

    const { result } = run();
    await result;

    expect(git.getFirstGitCommit).toHaveBeenCalled();
    expect(git.getGitDiff).toHaveBeenCalledWith('first-commit', 'HEAD');
  });

  it('rejects an unknown project', async () => {
    const { result } = run({ project: 'does-not-exist' });
    await expect(result).rejects.toThrow(/was not found/);
  });

  it('rejects a non-application project', async () => {
    const { result } = run({ project: 'shared-ui' });
    await expect(result).rejects.toThrow(/only applications/);
  });

  it('rejects an unsafe version string', async () => {
    const { result } = run({ releaseVersion: 'not a version' });
    await expect(result).rejects.toThrow(/Invalid version/);
  });
});
