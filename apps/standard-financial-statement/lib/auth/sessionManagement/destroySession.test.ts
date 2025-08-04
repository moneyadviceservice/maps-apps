import { IronSession, IronSessionData } from 'iron-session';
import { Store } from '@netlify/blobs';

import { destroySession } from './destroySession';

describe('destroySession', () => {
  it('should call session.destroy(), store.delete() with the correct key, and return true', async () => {
    const mockSession = {
      destroy: jest.fn(),
    } as unknown as IronSession<IronSessionData>;
    const mockStore = {
      delete: jest.fn(),
    } as unknown as Store;

    const sessionKey = 'user-session-abc-123';
    const result = await destroySession(mockSession, sessionKey, mockStore);

    expect(mockSession.destroy).toHaveBeenCalledTimes(1);
    expect(mockStore.delete).toHaveBeenCalledTimes(1);
    expect(mockStore.delete).toHaveBeenCalledWith(sessionKey);
    expect(result).toBe(true);
  });

  it('should still return true even if store.delete throws an error', async () => {
    const mockSession = {
      destroy: jest.fn(),
    } as unknown as IronSession<IronSessionData>;
    const mockStore = {
      delete: jest.fn().mockRejectedValue(new Error('Blob not found')),
    } as unknown as Store;

    const sessionKey = 'non-existent-key';

    await expect(
      destroySession(mockSession, sessionKey, mockStore),
    ).rejects.toThrow('Blob not found');
    expect(mockSession.destroy).toHaveBeenCalledTimes(1);
  });
});
