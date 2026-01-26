import { redisGet } from '@maps-react/redis/helpers';

import { mockEntry, mockSessionId } from '../mocks';
import { Entry } from '../types';
import { getStoreEntry } from './getStoreEntry';

jest.mock('@maps-react/redis/helpers', () => ({
  redisGet: jest.fn(),
}));

describe('getStoreEntry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the entry when session data is found', async () => {
    (redisGet as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockEntry));
    const result = await getStoreEntry(mockSessionId);
    expect(result).toEqual(mockEntry);
  });

  it('should return an empty object if the key is null', async () => {
    const result = await getStoreEntry(null);
    expect(result).toEqual({} as Entry);
  });

  it('should throw an error if the session data is not found', async () => {
    (redisGet as jest.Mock).mockResolvedValueOnce(null);
    await expect(getStoreEntry(mockSessionId)).rejects.toThrow(
      'Session data not found',
    );
  });
});
