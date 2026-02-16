import { redisRestGet } from '@maps-react/redis/rest-client';

import { mockEntry, mockSessionId } from '../mocks';
import { Entry } from '../types';
import { getStoreEntry } from './getStoreEntry';

jest.mock('@maps-react/redis/rest-client', () => ({
  redisRestGet: jest.fn(),
}));

describe('getStoreEntry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the entry when session data is found', async () => {
    (redisRestGet as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { value: JSON.stringify(mockEntry) },
    });
    const result = await getStoreEntry(mockSessionId);
    expect(result).toEqual(mockEntry);
  });

  it('should return an empty object if the key is null', async () => {
    const result = await getStoreEntry(null);
    expect(result).toEqual({} as Entry);
  });

  it('should throw an error if session data is not found', async () => {
    (redisRestGet as jest.Mock).mockResolvedValueOnce({
      success: false,
      data: null,
    });
    await expect(getStoreEntry(mockSessionId)).rejects.toThrow(
      '[getStoreEntry] Session data not found',
    );
  });
});
