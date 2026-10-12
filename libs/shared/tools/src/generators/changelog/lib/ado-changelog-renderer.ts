import type { ChangelogChange } from 'nx/release/changelog-renderer';
import DefaultChangelogRenderer from 'nx/release/changelog-renderer';
import { getCommitHash } from 'nx/src/command-line/release/utils/git';

import type { AdoChangelogRenderOptions } from './render-options';

/** Matches Azure DevOps' "Related work items: #123, #456" commit-body trailer lines. */
const RELATED_WORK_ITEMS_RE = /^Related work items:.*$/gim;

export default class AdoChangelogRenderer extends DefaultChangelogRenderer {
  protected declare changelogRenderOptions: AdoChangelogRenderOptions;
  private readonly fullHashes = new Map<string, string>();

  protected filterChanges(changes: ChangelogChange[]): ChangelogChange[] {
    return changes;
  }

  async render(): Promise<string> {
    await this.populateFullHashes(this.changes);
    return super.render();
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
