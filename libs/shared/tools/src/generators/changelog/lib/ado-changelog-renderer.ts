import type { ChangelogChange } from 'nx/release/changelog-renderer';
import DefaultChangelogRenderer from 'nx/release/changelog-renderer';
import { getCommitHash } from 'nx/src/command-line/release/utils/git';

import type { AppChangelogChange, ChangeCategory } from './build-changes';
import type { AdoChangelogRenderOptions } from './render-options';

/** Matches Azure DevOps' "Related work items: #123, #456" commit-body trailer lines. */
const RELATED_WORK_ITEMS_RE = /^Related work items:.*$/gim;

/** Entry sections in render order, each listing one change category. */
const SECTIONS: { category: ChangeCategory; title: string }[] = [
  { category: 'app', title: 'Application changes' },
  { category: 'monorepo', title: 'Monorepo changes' },
];

export default class AdoChangelogRenderer extends DefaultChangelogRenderer {
  protected declare changelogRenderOptions: AdoChangelogRenderOptions;
  protected declare relevantChanges: AppChangelogChange[];
  private readonly fullHashes = new Map<string, string>();

  protected filterChanges(changes: ChangelogChange[]): ChangelogChange[] {
    return changes;
  }

  async render(): Promise<string> {
    await this.populateFullHashes(this.changes);
    return super.render();
  }

  /**
   * Render the entry as an "Application changes" section followed by a
   * "Monorepo changes" section, each grouped by commit type as Nx's default
   * entry is (one heading level down). A section with no changes is omitted.
   */
  protected renderChangesByType(): string[] {
    const lines: string[] = [];
    const types = this.conventionalCommitsConfig.types;

    for (const { category, title } of SECTIONS) {
      const changes = this.relevantChanges.filter(
        (change) => change.category === category,
      );
      if (changes.length === 0) {
        continue;
      }

      lines.push('', `### ${title}`);

      for (const type of Object.keys(types)) {
        const group = changes.filter((change) => change.type === type);
        if (group.length === 0) {
          continue;
        }
        lines.push(
          '',
          `#### ${types[type].changelog.title}`,
          '',
          ...group.map((change) => this.formatChange(change)),
        );
      }
    }

    return lines;
  }

  protected renderVersionTitle(): string {
    const date = this.changelogRenderOptions.versionTitleDate
      ? ` (${new Date().toISOString().slice(0, 10)})`
      : '';
    return `## ${this.changelogEntryVersion}${date}`;
  }

  protected formatChange(change: ChangelogChange): string {
    const { adoBaseUrl, commitReferences, commitUrlFormat } =
      this.changelogRenderOptions;

    let line = super.formatChange(change);

    if (adoBaseUrl) {
      for (const id of this.extractWorkItems(change.body)) {
        line += ` ([#${id}](${adoBaseUrl}/${id}))`;
      }
    }

    // Link the commit by its full hash.
    if (commitReferences && change.shortHash && commitUrlFormat) {
      const fullHash =
        this.fullHashes.get(change.shortHash) ?? change.shortHash;
      const url = commitUrlFormat.replaceAll('{hash}', fullHash);
      line += ` ([${change.shortHash}](${url}))`;
    }

    return line;
  }

  private async populateFullHashes(changes: ChangelogChange[]): Promise<void> {
    for (const change of changes) {
      if (!change.shortHash || this.fullHashes.has(change.shortHash)) {
        continue;
      }
      this.fullHashes.set(
        change.shortHash,
        await getCommitHash(change.shortHash),
      );
    }
  }

  /**
   * Work-item ids from the commit body's "Related work items: #id" trailer
   */
  private extractWorkItems(body: string | undefined): string[] {
    if (!body) {
      return [];
    }
    const ids: string[] = [];
    for (const line of body.match(RELATED_WORK_ITEMS_RE) ?? []) {
      for (const ref of line.match(/#\d+/g) ?? []) {
        const id = ref.slice(1);
        if (!ids.includes(id)) {
          ids.push(id);
        }
      }
    }
    return ids;
  }
}
