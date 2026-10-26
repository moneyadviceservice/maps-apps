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

function commit(overrides: Record<string, unknown> = {}) {
  return {
    message: '',
    body: '',
    shortHash: 'aaaaaaa',
    author: { name: 'Dev', email: 'dev@example.com' },
    authors: [{ name: 'Dev', email: 'dev@example.com' }],
    type: 'feat',
    scope: 'mortgage-calculator',
    description: 'a change',
    isBreaking: false,
    references: [],
    revertedHashes: [],
    affectedFiles: [FILES.app],
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

  async function generate(
    commits: ReturnType<typeof commit>[],
    options: Record<string, unknown> = {},
  ) {
    setCommits(commits);
    const { tree, result } = run(options);
    const callback = await result;
    return { tree, callback, md: tree.read(CHANGELOG_PATH, 'utf-8') ?? '' };
  }

  it('renders an app change as a normal entry with a full-hash commit link', async () => {
    const { md } = await generate([
      commit({ shortHash: 'app0001', type: 'fix', description: 'fix copy' }),
    ]);

    expect(md).toContain('fix copy');
    // The short hash is resolved to its full hash for the commit link.
    expect(md).toContain('/commit/full-app0001');
  });

  it('keeps every conventional type, e.g. chore alongside feat', async () => {
    const { md } = await generate([
      commit({ type: 'chore', description: 'tidy up' }),
      commit({ type: 'feat', description: 'shiny feature' }),
    ]);

    expect(md).toContain('shiny feature');
    // chore is no longer dropped; it renders under its own section.
    expect(md).toContain('tidy up');
    expect(md).toContain('🏡 Chore');
  });

  it('splits the entry into application and monorepo sections, grouped by type', async () => {
    const { md } = await generate([
      commit({
        type: 'chore',
        scope: 'mortgage-calculator',
        description: 'update back link',
      }),
      commit({
        type: 'feat',
        scope: 'repo',
        description: 'upgrade monorepo to Next.js 16',
      }),
      commit({
        type: 'feat',
        scope: '',
        description: 'add a page',
      }),
    ]);

    expect(md.split('\n').filter((line) => line.startsWith('#'))).toEqual([
      '# Changelog',
      expect.stringMatching(/^## 0\.2\.0 \(\d{4}-\d{2}-\d{2}\)$/),
      '### Application changes',
      '#### 🚀 Features',
      '#### 🏡 Chore',
      '### Monorepo changes',
      '#### 🚀 Features',
    ]);

    const monorepoAt = md.indexOf('### Monorepo changes');
    expect(md.indexOf('add a page')).toBeLessThan(monorepoAt);
    expect(md.indexOf('update back link')).toBeLessThan(monorepoAt);
    expect(md.indexOf('upgrade monorepo')).toBeGreaterThan(monorepoAt);
    // Every commit appears exactly once.
    expect(md.match(/\/commit\/full-/g)).toHaveLength(3);
  });

  it.each([
    ['Application changes', 'mortgage-calculator'],
    ['Monorepo changes', 'repo'],
  ])(
    'renders only the %s section when there is one kind of change',
    async (section, scope) => {
      const { md } = await generate([commit({ scope })]);

      expect(md).toContain(`### ${section}`);
      expect(md.match(/^### /gm)).toHaveLength(1);
    },
  );

  it('skips non-conventional commits (Nx types them __INVALID__)', async () => {
    const { tree } = await generate([
      commit({
        type: '__INVALID__',
        scope: '',
        description: 'Merge branch main',
      }),
    ]);

    // Nothing changelog-worthy remains, so no file is written.
    expect(tree.exists(CHANGELOG_PATH)).toBe(false);
  });

  it('ignores commits outside the app folder (writes nothing)', async () => {
    // A commit that never touched apps/mortgage-calculator/** is not an app
    // change, so there is nothing to write.
    const { tree } = await generate([
      commit({
        scope: 'ui',
        description: 'shared change',
        affectedFiles: [FILES.lib],
      }),
    ]);

    expect(tree.exists(CHANGELOG_PATH)).toBe(false);
  });

  it('links only the work items in the "Related work items" trailer', async () => {
    const { md } = await generate([
      commit({
        type: 'fix',
        // Neither the 5-digit subject number nor the stray body #ref is a work
        // item: only ids on the trailer are linked.
        description: 'reduce timeout to 30000',
        body: 'Fixes upstream #936.\n\nRelated work items: #51888',
      }),
    ]);

    expect(md).toContain('[#51888](');
    expect(md).toContain('/_workitems/edit/51888');
    expect(md).not.toContain('/_workitems/edit/30000');
    expect(md).not.toContain('/_workitems/edit/936');
  });

  it('links multiple work items from one trailer', async () => {
    const { md } = await generate([
      commit({
        description: 'two work items',
        body: 'Related work items: #50894, #50895',
      }),
    ]);

    expect(md).toContain('/_workitems/edit/50894');
    expect(md).toContain('/_workitems/edit/50895');
  });

  it('inserts the new entry below the H1 and above older versions', async () => {
    setCommits([commit()]);

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
    const { md } = await generate([commit()]);

    expect(md.startsWith('# Changelog')).toBe(true);
  });

  it('commits via the returned callback when --commit is set (no tag)', async () => {
    const { callback } = await generate([commit()], { commit: true });
    expect(typeof callback).toBe('function');

    await (callback as () => Promise<void>)();

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
    const { tree, callback } = await generate([commit()]);

    // No callback means Nx runs no post-generation git side effects.
    expect(callback).toBeUndefined();
    expect(tree.exists(CHANGELOG_PATH)).toBe(true);
    expect(git.gitAdd).not.toHaveBeenCalled();
    expect(git.gitCommit).not.toHaveBeenCalled();
  });

  it('writes nothing and runs no git commands on a preview run', async () => {
    const { tree, callback } = await generate([commit()], { preview: true });

    expect(callback).toBeUndefined();
    expect(tree.exists(CHANGELOG_PATH)).toBe(false);
    expect(git.gitAdd).not.toHaveBeenCalled();
  });

  it('uses the first commit as the boundary for a first release', async () => {
    (execCommand as jest.Mock).mockResolvedValue('');
    await generate([commit()]);

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
