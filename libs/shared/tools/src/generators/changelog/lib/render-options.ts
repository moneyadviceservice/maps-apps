import type { DefaultChangelogRenderOptions } from 'nx/release/changelog-renderer';

/**
 * Render options for {@link AdoChangelogRenderer}. Extends Nx's default render
 * options with the Azure DevOps URLs used to linkify work items and commits.
 */
export interface AdoChangelogRenderOptions
  extends DefaultChangelogRenderOptions {
  adoBaseUrl?: string;
  commitUrlFormat?: string;
}

export const ADO_WORK_ITEM_BASE_URL =
  'https://dev.azure.com/moneyandpensionsservice/MaPS%20Digital/_workitems/edit';

export const ADO_COMMIT_URL_FORMAT =
  'https://dev.azure.com/moneyandpensionsservice/MaPS%20Digital/_git/maps-apps/commit/{hash}';

export const DEFAULT_RENDER_OPTIONS: AdoChangelogRenderOptions = {
  authors: false,
  commitReferences: true,
  versionTitleDate: true,
  adoBaseUrl: ADO_WORK_ITEM_BASE_URL,
  commitUrlFormat: ADO_COMMIT_URL_FORMAT,
};
