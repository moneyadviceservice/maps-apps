import { GetServerSidePropsContext } from 'next';

// Mocks
const mockDeleteStoreEntry = jest.fn();
jest.mock('../store', () => ({
  deleteStoreEntry: mockDeleteStoreEntry,
}));

describe('cleanupSession', () => {
  beforeEach(() => {
    mockDeleteStoreEntry.mockReset();
  });

  it('calls deleteStoreEntry and sets the expired cookie', async () => {
    const setHeader = jest.fn();
    const context = {
      res: { setHeader },
    } as unknown as GetServerSidePropsContext;
    const { cleanupSession: testedCleanupSession } = await import(
      '../store/cleanupSession'
    );
    await testedCleanupSession(context);
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
    const { cleanupSession: testedCleanupSession } = await import(
      '../store/cleanupSession'
    );
    await testedCleanupSession(context);
    expect(setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      'fsid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
    );
  });
});
