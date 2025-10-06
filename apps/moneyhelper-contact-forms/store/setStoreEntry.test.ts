import { redisSet } from '@maps-react/redis/helpers';

import { Entry } from '../lib/types';
import { setStoreEntry } from './setStoreEntry';

jest.mock('@maps-react/redis/helpers', () => ({
  redisSet: jest.fn(),
}));

describe('setStoreEntry', () => {
  const mockKey = 'mock-key';
  const mockEntry = { data: {} } as Entry;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call redisSet with the key and stringified entry', async () => {
    await setStoreEntry(mockKey, mockEntry);
    expect(redisSet).toHaveBeenCalledWith(mockKey, JSON.stringify(mockEntry));
  });

  it('should throw an error if key is null', async () => {
    await expect(setStoreEntry(null, mockEntry)).rejects.toThrow(
      '[setStoreEntry] No session key provided',
    );
    expect(redisSet).not.toHaveBeenCalled();
  });
});
