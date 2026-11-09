import { GetServerSidePropsContext } from 'next';

import { cleanupSession } from './cleanupSession';
import { deleteStoreEntry } from './deleteStoreEntry';

// Mocks
jest.mock('./deleteStoreEntry', () => ({
  deleteStoreEntry: jest.fn(),
}));
jest.mock('../utils/getCookieName', () => ({
  getCookieName: () => 'fsid',
}));
const mockDeleteStoreEntry = jest.mocked(deleteStoreEntry);

describe('cleanupSession', () => {
  beforeEach(() => {
    mockDeleteStoreEntry.mockReset();
  });

  it('calls deleteStoreEntry and sets the expired cookie', async () => {
    const setHeader = jest.fn();
    const context = {
      res: { setHeader },
    } as unknown as GetServerSidePropsContext;
    await cleanupSession(context);
    expect(mockDeleteStoreEntry).toHaveBeenCalledWith(context);
    expect(setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      'fsid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
    );
  });

  it('swallows errors from deleteStoreEntry and still sets the cookie', async () => {
    mockDeleteStoreEntry.mockRejectedValue(new Error('fail'));
    const setHeader = jest.fn();
    const context = {
      res: { setHeader },
    } as unknown as GetServerSidePropsContext;
    await cleanupSession(context);
    expect(setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      'fsid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
    );
  });
});
