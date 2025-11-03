import { fetchHomepage } from './homepage';
import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

jest.mock('@maps-react/utils/aemHeadlessClient');

describe('fetchHomepage', () => {
  const mockAemClient = aemHeadlessClient;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  const mockHomepageData = {
    title: 'Test Homepage',
    seoTitle: 'Test Homepage',
    seoDescription: 'Test Homepage Description',
    breadcrumbs: [],
    description: {
      json: [
        {
          nodeType: 'paragraph',
          content: [{ nodeType: 'text', value: 'Test description', marks: [] }],
        },
      ],
    },
    cards: [],
    video: undefined,
    content: undefined,
  };

  it('should fetch and return homepage data successfully', async () => {
    mockAemClient.runPersistedQuery = jest.fn().mockResolvedValue({
      data: {
        homepageList: {
          items: [mockHomepageData],
        },
      },
    });

    const result = await fetchHomepage('en');

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'evidence-hub/homepage-en',
    );
    expect(result).toEqual(mockHomepageData);
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should use correct query name for different languages', async () => {
    mockAemClient.runPersistedQuery = jest.fn().mockResolvedValue({
      data: {
        homepageList: {
          items: [mockHomepageData],
        },
      },
    });

    await fetchHomepage('cy');

    expect(mockAemClient.runPersistedQuery).toHaveBeenCalledWith(
      'evidence-hub/homepage-cy',
    );
  });

  it('should return error object when items array is empty', async () => {
    mockAemClient.runPersistedQuery = jest.fn().mockResolvedValue({
      data: {
        homepageList: {
          items: [],
        },
      },
    });

    const result = await fetchHomepage('en');

    expect(result).toEqual({ error: true });
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should handle errors and return error object', async () => {
    const mockError = new Error('Failed to fetch');
    mockAemClient.runPersistedQuery = jest.fn().mockRejectedValue(mockError);

    const result = await fetchHomepage('en');

    expect(result).toEqual({ error: true });
    expect(console.error).toHaveBeenCalledWith(
      'failed to fetch homepage',
      mockError,
    );
  });

  it('should handle network errors gracefully', async () => {
    mockAemClient.runPersistedQuery = jest
      .fn()
      .mockRejectedValue(new Error('Network error'));

    const result = await fetchHomepage('en');

    expect(result).toEqual({ error: true });
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle API errors gracefully', async () => {
    mockAemClient.runPersistedQuery = jest
      .fn()
      .mockRejectedValue(new Error('API error'));

    const result = await fetchHomepage('fr');

    expect(result).toEqual({ error: true });
    expect(console.error).toHaveBeenCalledWith(
      'failed to fetch homepage',
      expect.any(Error),
    );
  });
});
