import { getStore } from '@netlify/blobs';

import { Entry } from '../lib/types';
import { loadEnv } from '../lib/utils/';
import { getStoreEntry } from './getStoreEntry';

jest.mock('@netlify/blobs');
jest.mock('../lib/utils/loadEnv');

describe('getStoreEntry', () => {
  const mockStore = {
    get: jest.fn(),
  };
  const mockStoreName = 'test-store';
  const mockKey = 'mock-key';
  const mockEntry = { data: {} } as Entry;

  beforeEach(() => {
    jest.clearAllMocks();
    (loadEnv as jest.Mock).mockReturnValue({ name: mockStoreName });
    (getStore as jest.Mock).mockReturnValue(mockStore);
  });

  it('should return the entry and store when session data is found', async () => {
    mockStore.get.mockResolvedValueOnce(mockEntry);

    const result = await getStoreEntry(mockKey);

    expect(result).toEqual({ entry: mockEntry, store: mockStore });
  });

  it('should return an empty object if the key is null', async () => {
    const result = await getStoreEntry(null);
    expect(result).toEqual({ entry: {} as Entry, store: {} });
  });

  it('should throw an error if the session data is not found', async () => {
    mockStore.get.mockResolvedValueOnce(null);

    await expect(getStoreEntry(mockKey)).rejects.toThrow(
      'Session data not found',
    );
  });
});
