import type { ChangelogChange } from 'nx/release/changelog-renderer';
import { mapCommitToChange } from 'nx/src/command-line/release/changelog/commit-utils';
import {
  getGitDiff,
  GitCommit,
  parseCommits,
} from 'nx/src/command-line/release/utils/git';
import { getChangedComponent, findAffectedApps } from './find-affected-apps';

function isTestFile(file: string): boolean {
  return /\.(test|spec)\.(tsx?|jsx?)$/.test(file);
}

function isStorybookFile(file: string): boolean {
  return /\.stories\.(ts|tsx|js|jsx)$/.test(file);
}

export function isIgnoredFile(file: string): boolean {
  return isTestFile(file) || isStorybookFile(file);
}

/**
 * Determines whether a commit affects a specific app through direct or shared
 * component dependencies.
 *
 * A commit affects an app if it directly modifies app files, or if it modifies
 * a shared component that the app consumes directly or indirectly through
 * another shared library. Test files are ignored.
 *
 * @param commit - The commit to check, including its affected files.
 * @param appRoot - The app root path (e.g. 'apps/budget-planner').
 * @param appName - The app name extracted from the app root.
 * @returns True if the commit should be included in the app's changelog.
 */
async function commitAffectsApp(
  commit: GitCommit,
  appRoot: string,
  appName: string,
): Promise<boolean> {
  for (const file of commit.affectedFiles) {
    if (isIgnoredFile(file)) {
      continue;
    }

    if (file.startsWith(`${appRoot}/`)) {
      return true;
    }

    const component = getChangedComponent(file);

    if (component) {
      const apps = await findAffectedApps(component);

      if (apps.includes(appName)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Gather the changelog-worthy changes for an app since `fromRef`.
 *
 * Only commits that affect the app are included. This includes direct app
 * changes and changes to shared components that the app consumes directly or
 * indirectly through shared library dependencies.
 *
 * Unrelated app changes are excluded, and test files are ignored.
 *
 * Every conventional commit type is preserved (feat, fix, chore, docs, ...).
 */
export async function buildChanges(
  appRoot: string,
  fromRef: string,
): Promise<ChangelogChange[]> {
  const commits = parseCommits(await getGitDiff(fromRef, 'HEAD'));
  const appName = appRoot.replace('apps/', '');

  const appCommits = [];

  for (const commit of commits) {
    if (await commitAffectsApp(commit, appRoot, appName)) {
      appCommits.push(commit);
    }
  }

  return appCommits
    .map((commit) => mapCommitToChange(commit, []))
    .filter((change) => change.type !== '__INVALID__');
}
