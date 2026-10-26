import { redisRestDel } from '@maps-react/redis/rest-client';

import { mockContext, mockSessionId } from '../mocks';
import { getSessionId } from '../utils';
import { deleteStoreEntry } from './deleteStoreEntry';

jest.mock('@maps-react/redis/rest-client', () => ({
  redisRestDel: jest.fn(),
}));
jest.mock('../utils', () => ({
  getSessionId: jest.fn(),
}));

describe('deleteStoreEntry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call redisRestDel with the session key', async () => {
    (getSessionId as jest.Mock).mockReturnValue(mockSessionId);
    (redisRestDel as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { deletedCount: 1 },
    });
    await deleteStoreEntry(mockContext);
    expect(redisRestDel).toHaveBeenCalledWith(mockSessionId);
  });

  it('should throw an error if session key is not found', async () => {
    (getSessionId as jest.Mock).mockReturnValue(null);
    await expect(deleteStoreEntry(mockContext)).rejects.toThrow(
      '[deleteStoreEntry] No session key found in context',
    );
    expect(redisRestDel).not.toHaveBeenCalled();
  });

  it('should throw an error if redisRestDel fails', async () => {
    (getSessionId as jest.Mock).mockReturnValue(mockSessionId);
    (redisRestDel as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Network error',
    });
    await expect(deleteStoreEntry(mockContext)).rejects.toThrow(
      '[deleteStoreEntry] Failed to delete entry: Network error',
    );
  });
});
