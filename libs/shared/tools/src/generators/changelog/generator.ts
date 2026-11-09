import { DEFAULT_CONVENTIONAL_COMMITS_CONFIG } from 'nx/src/command-line/release/config/conventional-commits';
import { gitAdd, gitCommit } from 'nx/src/command-line/release/utils/git';
import {
  createProjectGraphAsync,
  formatFiles,
  GeneratorCallback,
  logger,
  Tree,
} from '@nx/devkit';

import AdoChangelogRenderer from './lib/ado-changelog-renderer';
import { buildChanges } from './lib/build-changes';
import { DEFAULT_RENDER_OPTIONS } from './lib/render-options';
import { resolveFromRef } from './lib/resolve-from-ref';
import { ChangelogGeneratorSchema } from './schema';

type RendererConfig = ConstructorParameters<typeof AdoChangelogRenderer>[0];

const NOOP_REMOTE_RELEASE_CLIENT = {
  getRemoteRepoData: () => null,
  remoteReleaseProviderName: 'none',
  formatReferences: () => '',
  applyUsernameToAuthors: async () => undefined,
} as unknown as RendererConfig['remoteReleaseClient'];

export default async function changelogGenerator(
  tree: Tree,
  options: ChangelogGeneratorSchema,
): Promise<GeneratorCallback | void> {
  const { project, releaseVersion } = options;

  if (!releaseVersion || /\s/.test(releaseVersion)) {
    throw new Error(
      `Invalid version "${releaseVersion}". Provide a tag-safe version such as 1.2.0.`,
    );
  }

  const graph = await createProjectGraphAsync();
  const node = graph.nodes[project];
  if (!node) {
    throw new Error(`Project "${project}" was not found in the workspace.`);
  }
  if (node.data.projectType !== 'application') {
    throw new Error(
      `Project "${project}" is a ${node.data.projectType}; only applications are released.`,
    );
  }

  const appRoot = node.data.root;

  const fromRef = await resolveFromRef(project, appRoot, options.from);
  const appChanges = await buildChanges(appRoot, fromRef);

  const renderer = new AdoChangelogRenderer({
    changes: appChanges,
    changelogEntryVersion: releaseVersion,
    project,
    entryWhenNoChanges: false,
    isVersionPlans: false,
    changelogRenderOptions: DEFAULT_RENDER_OPTIONS,
    conventionalCommitsConfig:
      DEFAULT_CONVENTIONAL_COMMITS_CONFIG as RendererConfig['conventionalCommitsConfig'],
    remoteReleaseClient: NOOP_REMOTE_RELEASE_CLIENT,
  });

  const entry = (await renderer.render()).trim();

  if (!entry) {
    logger.warn(
      `No changelog-worthy changes found for ${project} since ${fromRef}. Nothing to write.`,
    );
    return;
  }

  const changelogPath = `${appRoot}/CHANGELOG.md`;

  if (options.preview) {
    logger.info(`\n--- ${changelogPath} (preview) ---\n${entry}\n`);
    return;
  }

  const existing = tree.read(changelogPath, 'utf-8') ?? '';
  tree.write(changelogPath, insertEntry(existing, entry));

  await formatFiles(tree);

  // Writing the file is the default; committing is opt-in via --commit
  if (!options.commit) {
    logger.info(
      `Wrote ${changelogPath}. Re-run with --commit to record it as a 'chore(release): ${project} ${releaseVersion}' commit.`,
    );
    return;
  }

  return async () => {
    await gitAdd({ changedFiles: [changelogPath] });
    await gitCommit({
      messages: [`chore(release): ${project} ${releaseVersion}`],
      additionalArgs: ['--', changelogPath],
    });
  };
}

/**
 * Insert `entry` directly below the file's `# Changelog` H1 (creating the file
 * if needed), keeping the newest version at the top and above older entries.
 */
function insertEntry(existing: string, entry: string): string {
  if (!existing.trim()) {
    return `# Changelog\n\n${entry}\n`;
  }
  const lines = existing.split('\n');
  const h1Index = lines.findIndex((line) => /^#\s/.test(line));
  const insertAt = h1Index >= 0 ? h1Index + 1 : 0;
  lines.splice(insertAt, 0, '', entry);
  return lines.join('\n');
}
