import { mockSiteSettings } from 'lib/mocks/mockSiteSettings';
import {
  fetchDetailsPage,
  fetchDetailsPageList,
  fetchFrameworkPage,
  fetchSideNavigation,
  fetchStartPage,
  fetchSiteSettings,
  fetchUpdatesPage,
  fetchLearningPathwayHubMetadata,
  fetchTags,
} from './fetchContent';
import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';
import {
  mockDirectoryPageMetadata,
  mockPageDetails,
} from 'lib/mocks/mockPageDetails';
import { mockSideNavigation } from '@maps-react/mps/components/SideNavigation/sideNavigationMocks';
import { mockTags } from 'lib/mocks/mockTags';

jest.mock('@maps-react/utils/aemHeadlessClient', () => ({
  aemHeadlessClient: {
    runPersistedQuery: jest.fn(),
  },
}));

const mockAemClient = jest.mocked(aemHeadlessClient);

describe('fetchSiteSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch siteSettings succesfully', async () => {
    mockAemClient.runPersistedQuery.mockResolvedValueOnce({
      data: {
        siteSettingsByPath: {
          item: mockSiteSettings,
        },
      },
    });

    const siteConfig = await fetchSiteSettings('en');

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'evidence-hub/site-settings-en',
    );

    expect(siteConfig).toEqual(mockSiteSettings);
  });

  it('should return error message if request fails', async () => {
    mockAemClient.runPersistedQuery.mockRejectedValue("Can't find resource");

    const errorSiteSettings = await fetchSiteSettings('en');
    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'evidence-hub/site-settings-en',
    );

    expect(console.error).toHaveBeenCalledWith(
      'failed to site settings:',
      expect.any(String),
    );
    expect(errorSiteSettings).toBeUndefined();
  });
});

describe('fetchSideNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch and return the first side navigation item successfully', async () => {
    mockAemClient.runPersistedQuery.mockResolvedValueOnce({
      data: {
        sideNavigationList: {
          items: [mockSideNavigation],
        },
      },
    });

    const sideNavigation = await fetchSideNavigation('en');

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'learning-pathway/get-side-nav-en',
    );
    expect(sideNavigation).toEqual(mockSideNavigation);
  });

  it('should request the Welsh query when the language is cy', async () => {
    mockAemClient.runPersistedQuery.mockResolvedValueOnce({
      data: {
        sideNavigationList: {
          items: [mockSideNavigation],
        },
      },
    });

    await fetchSideNavigation('cy');

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'learning-pathway/get-side-nav-cy',
    );
  });

  it('should return null when no side navigation items are found', async () => {
    mockAemClient.runPersistedQuery.mockResolvedValueOnce({
      data: {
        sideNavigationList: {
          items: [],
        },
      },
    });

    expect(await fetchSideNavigation('en')).toBeNull();
  });

  it('should return null and log an error when the request fails', async () => {
    mockAemClient.runPersistedQuery.mockRejectedValue('Not Found');

    expect(await fetchSideNavigation('en')).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      'Failed to get side navigation',
      expect.any(String),
    );
  });
});

describe('fetchUpdatesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch and return the first updates page item successfully', async () => {
    const mockUpdatesPage = { pageTitle: 'Latest updates' };

    mockAemClient.runPersistedQuery.mockResolvedValueOnce({
      data: {
        updatePageList: {
          items: [mockUpdatesPage],
        },
      },
    });

    const updatesPage = await fetchUpdatesPage('en');

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'learning-pathway/get-updates-page-en',
    );
    expect(updatesPage).toEqual(mockUpdatesPage);
  });

  it('should request the Welsh query when the language is cy', async () => {
    mockAemClient.runPersistedQuery.mockResolvedValueOnce({
      data: {
        updatePageList: {
          items: [{ pageTitle: 'Diweddariadau diweddaraf' }],
        },
      },
    });

    await fetchUpdatesPage('cy');

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'learning-pathway/get-updates-page-cy',
    );
  });

  it('should return null when no updates page items are found', async () => {
    mockAemClient.runPersistedQuery.mockResolvedValueOnce({
      data: {
        updatePageList: {
          items: [],
        },
      },
    });

    expect(await fetchUpdatesPage('en')).toBeNull();
  });

  it('should return null and log an error when the request fails', async () => {
    mockAemClient.runPersistedQuery.mockRejectedValue("Can't find resource");

    expect(await fetchUpdatesPage('en')).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      'Failed to get updates page',
      expect.any(String),
    );
  });
});

describe('fetchDetailsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return an empty object when slug is not provided', async () => {
    const detailsPage = await fetchDetailsPage('en', '');

    expect(detailsPage).toEqual({});
    expect(mockAemClient.runPersistedQuery).not.toHaveBeenCalled();
  });

  it('should fetch and return the first details page item successfully', async () => {
    const mockDetailsPage = {
      slug: 'retirement-planning',
      pageTitle: 'Retirement planning',
    };

    mockAemClient.runPersistedQuery.mockResolvedValueOnce({
      data: {
        detailsPageList: {
          items: [mockDetailsPage],
        },
      },
    });

    const detailsPage = await fetchDetailsPage('en', 'retirement-planning');

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'learning-pathway/get-details-page-en',
      {
        slug: 'retirement-planning',
      },
    );
    expect(detailsPage).toEqual(mockDetailsPage);
  });

  it('should return an empty object when no details page items are found', async () => {
    mockAemClient.runPersistedQuery.mockResolvedValueOnce({
      data: {
        detailsPageList: {
          items: [],
        },
      },
    });

    const detailsPage = await fetchDetailsPage('en', 'missing-page');

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'learning-pathway/get-details-page-en',
      {
        slug: 'missing-page',
      },
    );
    expect(detailsPage).toEqual({});
  });

  it('should return an empty object and log an error when request fails', async () => {
    mockAemClient.runPersistedQuery.mockRejectedValue("Can't find resource");

    const detailsPage = await fetchDetailsPage('en', 'broken-page');

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'learning-pathway/get-details-page-en',
      {
        slug: 'broken-page',
      },
    );
    expect(console.error).toHaveBeenCalledWith(
      'Failed to get details page broken-page ',
      expect.any(String),
    );
    expect(detailsPage).toEqual({});
  });
});

describe('fetchFrameworkPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should fetch and return the first framework page item successfully', async () => {
    const mockFrameworkPage = {
      pageTitle: 'Debt Advice Quality Framework',
    };

    mockAemClient.runPersistedQuery.mockResolvedValueOnce({
      data: {
        frameworkPageList: {
          items: [mockFrameworkPage],
        },
      },
    });

    const frameworkPage = await fetchFrameworkPage('en');

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'learning-pathway/get-framework-page-en',
    );
    expect(frameworkPage).toEqual(mockFrameworkPage);
  });

  it('should return null when no framework page items are found', async () => {
    mockAemClient.runPersistedQuery.mockResolvedValueOnce({
      data: {
        frameworkPageList: {
          items: [],
        },
      },
    });

    const frameworkPage = await fetchFrameworkPage('en');

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'learning-pathway/get-framework-page-en',
    );
    expect(frameworkPage).toBeNull();
  });

  it('should return null and log an error when request fails', async () => {
    mockAemClient.runPersistedQuery.mockRejectedValue("Can't find resource");

    const frameworkPage = await fetchFrameworkPage('en');

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'learning-pathway/get-framework-page-en',
    );
    expect(console.error).toHaveBeenCalledWith(
      'Failed to get framework page',
      expect.any(String),
    );
    expect(frameworkPage).toBeNull();
  });
});

describe('fetchStartPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch and return the first start page item successfully', async () => {
    const mockStartPage = {
      startPageActivityHeading: 'Learning pathway hub introduction',
    };

    mockAemClient.runPersistedQuery.mockResolvedValueOnce({
      data: {
        startPageList: {
          items: [mockStartPage],
        },
      },
    });

    const startPage = await fetchStartPage('en');

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'learning-pathway/get-start-page-en',
    );
    expect(startPage).toEqual(mockStartPage);
  });

  it('should return an empty object when no start page items are found', async () => {
    mockAemClient.runPersistedQuery.mockResolvedValueOnce({
      data: {
        startPageList: {
          items: [],
        },
      },
    });

    const startPage = await fetchStartPage('en');

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'learning-pathway/get-start-page-en',
    );
    expect(startPage).toEqual({});
  });

  it('should return an empty object and log an error when request fails', async () => {
    mockAemClient.runPersistedQuery.mockRejectedValue("Can't find resource");

    const startPage = await fetchStartPage('en');

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'learning-pathway/get-start-page-en',
    );
    expect(console.error).toHaveBeenCalledWith(
      'Failed to get start page',
      expect.any(String),
    );
    expect(startPage).toEqual({});
  });
});

describe('Get page list details', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the detailsPageList content', async () => {
    mockAemClient.runPersistedQuery.mockResolvedValueOnce({
      data: {
        detailsPageList: {
          items: mockPageDetails,
        },
      },
    });

    const data = await fetchDetailsPageList('en');

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'learning-pathway/get-details-page-list-en',
    );

    expect(data).toEqual(mockPageDetails);
  });

  it('should return null if the fetchDetailsPageList request has failed', async () => {
    mockAemClient.runPersistedQuery.mockRejectedValue('The request has failed');

    const data = await fetchDetailsPageList('en');

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'learning-pathway/get-details-page-list-en',
    );

    expect(console.error).toHaveBeenCalledWith(
      'Failed to get details page list ',
      'The request has failed',
    );
    expect(data).toBeNull();
  });
});

describe('fetchLearningPathwayHubMetadata', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the fetchLearningPathwayHubMetadata content', async () => {
    for (const lang of ['en', 'cy']) {
      mockAemClient.runPersistedQuery.mockResolvedValueOnce({
        data: {
          learningPathwayHubPageByPath: {
            item: (mockDirectoryPageMetadata as Record<string, unknown>)[lang],
          },
        },
      });
      const data = await fetchLearningPathwayHubMetadata(lang);

      expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
        `learning-pathway/get-directory-page-metadata-${lang}`,
      );

      expect(data).toEqual(
        (mockDirectoryPageMetadata as Record<string, unknown>)[lang],
      );
    }
  });

  it('should return null if the fetchLearningPathwayHubMetadata request has failed', async () => {
    mockAemClient.runPersistedQuery.mockRejectedValue('The request has failed');

    const data = await fetchLearningPathwayHubMetadata('en');

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'learning-pathway/get-directory-page-metadata-en',
    );

    expect(console.error).toHaveBeenCalledWith(
      'Failed to get the Learning Pathway Hub metadata',
      'The request has failed',
    );
    expect(data).toBeNull();
  });
});

describe('fetchTags', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the fetchTags content', async () => {
    mockAemClient.runPersistedQuery.mockResolvedValueOnce({
      data: {
        tagsList: {
          items: mockTags,
        },
      },
    });
    const data = await fetchTags();

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      `learning-pathway/get-tags`,
    );

    expect(data).toEqual(mockTags);
  });

  it('should return null if the fetchTags request has failed', async () => {
    mockAemClient.runPersistedQuery.mockRejectedValue('The request has failed');

    const data = await fetchTags();

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'learning-pathway/get-tags',
    );

    expect(console.error).toHaveBeenCalledWith(
      'Failed to get tags list ',
      'The request has failed',
    );
    expect(data).toBeNull();
  });
});
