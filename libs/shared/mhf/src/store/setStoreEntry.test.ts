import { redisSet } from '@maps-react/redis/helpers';

import { mockEntry, mockSessionId } from '../mocks';
import { setStoreEntry } from './setStoreEntry';

jest.mock('@maps-react/redis/helpers', () => ({
  redisSet: jest.fn(),
}));

describe('setStoreEntry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call redisSet with the key and stringified entry', async () => {
    await setStoreEntry(mockSessionId, mockEntry);
    expect(redisSet).toHaveBeenCalledWith(
      mockSessionId,
      JSON.stringify(mockEntry),
    );
  });

  it('should throw an error if key is null', async () => {
    await expect(setStoreEntry(null, mockEntry)).rejects.toThrow(
      '[setStoreEntry] No session key provided',
    );
    expect(redisSet).not.toHaveBeenCalled();
  });
});
