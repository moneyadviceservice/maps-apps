import { getStore } from '@netlify/blobs';

import { Entry } from '../../lib/types';
import { loadEnv } from '../loadEnv';
import { deleteStoreEntry } from './deleteStoreEntry';

jest.mock('../loadEnv');
jest.mock('@netlify/blobs');

describe('deleteStoreEntry', () => {
  const store = {
    get: jest.fn(),
  };
  const mockStore = 'test-store';
  const mockKey = 'key';
  const mockData = { data: {} } as Entry;

  beforeEach(() => {
    jest.clearAllMocks();
    (loadEnv as jest.Mock).mockReturnValue({ name: mockStore });
    (getStore as jest.Mock).mockReturnValue(store);
  });

  it('should return the entry and store when data is found', async () => {
    store.get.mockResolvedValueOnce(mockData);
    const entry = await deleteStoreEntry(mockKey);
    expect(entry).toBeUndefined();
  });

  it('should throw an error if no key found', async () => {
    store.get.mockResolvedValueOnce(null);
    await expect(deleteStoreEntry(mockKey)).resolves.toBeUndefined();
  });
});
