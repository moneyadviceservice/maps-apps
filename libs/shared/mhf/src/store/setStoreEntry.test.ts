import { redisRestSet } from '@maps-react/redis/rest-client';

import { mockEntry, mockSessionId } from '../mocks';
import { setStoreEntry } from './setStoreEntry';

jest.mock('@maps-react/redis/rest-client', () => ({
  redisRestSet: jest.fn(),
}));

describe('setStoreEntry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call redisRestSet with the key and stringified entry', async () => {
    (redisRestSet as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { success: true },
    });
    await setStoreEntry(mockSessionId, mockEntry);
    expect(redisRestSet).toHaveBeenCalledWith(
      mockSessionId,
      JSON.stringify(mockEntry),
    );
  });

  it('should throw an error if key is null', async () => {
    await expect(setStoreEntry(null, mockEntry)).rejects.toThrow(
      '[setStoreEntry] No session key provided',
    );
    expect(redisRestSet).not.toHaveBeenCalled();
  });

  it('should throw an error if redisRestSet fails', async () => {
    (redisRestSet as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Network error',
    });
    await expect(setStoreEntry(mockSessionId, mockEntry)).rejects.toThrow(
      '[setStoreEntry] Failed to set entry: Network error',
    );
  });
});
