import { execCommand } from 'nx/src/command-line/release/utils/exec-command';
import {
  getCommitHash,
  getFirstGitCommit,
} from 'nx/src/command-line/release/utils/git';

/**
 * Resolve the commit to diff from when building a project's changelog.
 */
export async function resolveFromRef(
  project: string,
  appRoot: string,
  override?: string,
): Promise<string> {
  if (override) {
    return getCommitHash(override);
  }

  const changelog = `${appRoot}/CHANGELOG.md`;
  return (
    (await lastCommit(changelog, `^chore(release): ${project} `)) ??
    (await lastCommit(changelog)) ??
    getFirstGitCommit()
  );
}

/**
 * SHA of the most recent commit on HEAD's ancestry that touched `changelog`,
 */
async function lastCommit(
  changelog: string,
  grep?: string,
): Promise<string | null> {
  const args = ['log', '-n', '1', '--format=%H'];
  if (grep) {
    args.push(`--grep=${grep}`);
  }
  args.push('--', changelog);

  try {
    return (await execCommand('git', args)).trim() || null;
  } catch {
    return null;
  }
}
