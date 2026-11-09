import {
  DetailsPageModel,
  DetailsPagesListModel,
  DirectoryPageMetadata,
  FrameworkPageModel,
  StartPageModel,
  TagModel,
  UpdatePageModel,
} from 'lib/types/site.type';

import { SideNavigationModel } from '@maps-react/mps/types';
import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

export const fetchSiteSettings = async (lang: string) => {
  try {
    const {
      data: {
        siteSettingsByPath: { item },
      },
    } = await aemHeadlessClient.runPersistedQuery(
      `evidence-hub/site-settings-${lang?.length > 2 ? 'en' : lang}`,
    );

    return item;
  } catch (error) {
    console.error('failed to site settings:', error);
  }
};

export const fetchSideNavigation = async (
  lang: string,
): Promise<SideNavigationModel | null> => {
  try {
    const {
      data: {
        sideNavigationList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(
      `learning-pathway/get-side-nav-${lang}`,
    );

    return items?.length > 0 ? (items[0] as SideNavigationModel) : null;
  } catch (error) {
    console.error('Failed to get side navigation', error);
    return null;
  }
};

export const fetchUpdatesPage = async (
  lang: string,
): Promise<UpdatePageModel | null> => {
  try {
    const {
      data: {
        updatePageList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(
      `learning-pathway/get-updates-page-${lang}`,
    );

    return items?.length > 0 ? (items[0] as UpdatePageModel) : null;
  } catch (error) {
    console.error('Failed to get updates page', error);
    return null;
  }
};

export const fetchDetailsPage = async (lang: string, slug: string) => {
  if (!slug) return {};

  try {
    const {
      data: {
        detailsPageList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(
      `learning-pathway/get-details-page-${lang}`,
      {
        slug,
      },
    );

    return items?.length > 0 ? (items[0] as DetailsPageModel) : {};
  } catch (error) {
    console.error(`Failed to get details page ${slug} `, error);
    return {};
  }
};

export const fetchFrameworkPage = async (
  lang: string,
): Promise<FrameworkPageModel | null> => {
  try {
    const {
      data: {
        frameworkPageList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(
      `learning-pathway/get-framework-page-${lang}`,
    );

    return items?.length > 0 ? (items[0] as FrameworkPageModel) : null;
  } catch (error) {
    console.error('Failed to get framework page', error);
    return null;
  }
};

export const fetchStartPage = async (lang: string) => {
  try {
    const {
      data: {
        startPageList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(
      `learning-pathway/get-start-page-${lang}`,
    );

    return items?.length > 0 ? (items[0] as StartPageModel) : {};
  } catch (error) {
    console.error('Failed to get start page', error);
    return {};
  }
};

export const fetchLearningPathwayHubMetadata = async (
  lang: string,
): Promise<DirectoryPageMetadata | null> => {
  try {
    const {
      data: {
        learningPathwayHubPageByPath: { item },
      },
    } = await aemHeadlessClient.runPersistedQuery(
      `learning-pathway/get-directory-page-metadata-${lang}`,
    );

    return item as DirectoryPageMetadata;
  } catch (error) {
    console.error(`Failed to get the Learning Pathway Hub metadata`, error);
    return null;
  }
};

export const fetchDetailsPageList = async (
  lang: string,
): Promise<DetailsPagesListModel[] | null> => {
  try {
    const {
      data: {
        detailsPageList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(
      `learning-pathway/get-details-page-list-${lang}`,
    );

    return items as DetailsPagesListModel[];
  } catch (error) {
    console.error(`Failed to get details page list `, error);
    return null;
  }
};

export const fetchTags = async (): Promise<TagModel[] | null> => {
  try {
    const {
      data: {
        tagsList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(`learning-pathway/get-tags`);

    return items as TagModel[];
  } catch (error) {
    console.error(`Failed to get tags list `, error);
    return null;
  }
};
