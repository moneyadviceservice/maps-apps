import { deleteAllSessionData } from './deleteAllSessionData';

import { redisRestDel } from '@maps-react/redis/rest-client';

jest.mock('@maps-react/redis/rest-client', () => ({
  redisRestDel: jest.fn(),
}));

const mockSessionId = 'mock-session-id';
const mockRedisRestDel = jest.mocked(redisRestDel);

describe('Delete from memory api call', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRedisRestDel.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call deleteAllSessionData API', async () => {
    await deleteAllSessionData(mockSessionId);
    expect(redisRestDel).toHaveBeenCalledTimes(4);
    expect(redisRestDel).toHaveBeenNthCalledWith(
      1,
      `about-you:${mockSessionId}`,
    );
    expect(redisRestDel).toHaveBeenNthCalledWith(2, `income:${mockSessionId}`);
    expect(redisRestDel).toHaveBeenNthCalledWith(
      3,
      `essential-outgoings:${mockSessionId}`,
    );
    expect(redisRestDel).toHaveBeenNthCalledWith(4, `summary:${mockSessionId}`);
  });

  it('should throw when deleteAllSessionData input is empty', async () => {
    // @ts-expect-error - testing invalid input
    await expect(async () => await deleteAllSessionData()).rejects.toThrow(
      'sessionId is required',
    );
  });

  it('should throw when deleteAllSessionData input is incorrect type', async () => {
    // @ts-expect-error - testing invalid input
    await expect(async () => await deleteAllSessionData(123)).rejects.toThrow(
      'sessionId must be a string',
    );
  });

  it('should throw when redisRestDel throws', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockRedisRestDel.mockRejectedValueOnce(new Error('Redis error'));

    await expect(deleteAllSessionData(mockSessionId)).rejects.toThrow(
      'Error deleting session data from Redis',
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error deleting session data from Redis:',
      expect.objectContaining({ message: 'Error: Redis error' }),
    );
  });

  it('should throw when redisRestDel returns an unsuccessful response', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockRedisRestDel.mockResolvedValueOnce({
      success: false,
      error: 'Redis error',
    });

    await expect(deleteAllSessionData(mockSessionId)).rejects.toThrow(
      'Error deleting session data from Redis',
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error deleting session data from Redis:',
      expect.objectContaining({ message: 'Redis error' }),
    );
  });

  it('should use a fallback error when redisRestDel returns no error message', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockRedisRestDel.mockResolvedValueOnce({ success: false });

    await expect(deleteAllSessionData(mockSessionId)).rejects.toThrow(
      'Error deleting session data from Redis',
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error deleting session data from Redis:',
      expect.objectContaining({ message: 'Unknown error' }),
    );
  });
});
