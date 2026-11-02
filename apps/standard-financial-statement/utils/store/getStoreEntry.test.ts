import { getStore } from '@netlify/blobs';

import { Entry } from '../../lib/types';
import { loadEnv } from '../loadEnv';
import { getStoreEntry } from './getStoreEntry';

jest.mock('@netlify/blobs');
jest.mock('../loadEnv');

describe('getStoreEntry', () => {
  const storeMock = {
    get: jest.fn(),
  };
  const mockStoreName = 'sfs-test-store';
  const mockKey = 'sfs-key';
  const mockEntry = { data: {} } as Entry;

  beforeEach(() => {
    jest.clearAllMocks();
    (loadEnv as jest.Mock).mockReturnValue({ name: mockStoreName });
    (getStore as jest.Mock).mockReturnValue(storeMock);
  });

  it('should return the entry and store when data is found', async () => {
    storeMock.get.mockResolvedValueOnce(mockEntry);
    const entry = await getStoreEntry(mockKey);
    expect(entry).toEqual({ entry: mockEntry, store: storeMock });
  });

  it('should throw an error if no key found', async () => {
    storeMock.get.mockResolvedValueOnce(null);

    await expect(getStoreEntry(mockKey)).rejects.toThrow(
      'store data not found',
    );
  });
});
