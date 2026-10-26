import { deleteAllSessionData } from './deleteAllSessionData';

import { redisDel } from '@maps-react/redis/helpers';

jest.mock('@maps-react/redis/helpers', () => ({
  redisDel: jest.fn(),
}));

const mockSessionId = 'mock-session-id';

describe('Delete from memory api call', () => {
  it('should call deleteAllSessionData API', async () => {
    await deleteAllSessionData(mockSessionId);
    expect(redisDel).toHaveBeenCalledTimes(1);
    expect(redisDel).toHaveBeenCalledWith([
      `about-you:${mockSessionId}`,
      `income:${mockSessionId}`,
      `essential-outgoings:${mockSessionId}`,
      `summary:${mockSessionId}`,
    ]);
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

  it('should throw when redisDel throws', async () => {
    (redisDel as jest.Mock).mockRejectedValueOnce(new Error('Redis error'));

    await expect(
      async () => await deleteAllSessionData(mockSessionId),
    ).rejects.toThrow('Error deleting session data from Redis');
  });
});
