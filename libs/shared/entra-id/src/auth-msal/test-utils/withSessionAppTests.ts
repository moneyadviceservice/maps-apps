import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

/**
 * Shared test suite for app withSession wrappers (same behavior in TID and SFS).
 */
export function runWithSessionAppTests(
  withSession: (
    handler: NextApiHandler,
  ) => (req: NextApiRequest, res: NextApiResponse) => Promise<unknown>,
  getIronSession: jest.Mock,
): void {
  const mockSession = { isAuthenticated: true };
  const req = {} as NextApiRequest;
  const res = {} as NextApiResponse;

  beforeEach(() => {
    getIronSession.mockClear();
    getIronSession.mockResolvedValue(mockSession);
  });

  it('attaches session to req and calls handler', async () => {
    const handler = jest.fn().mockResolvedValue('handler-response');
    const wrapped = withSession(handler);
    const result = await wrapped(req, res);

    expect(getIronSession).toHaveBeenCalledWith(req, res, expect.any(Object));
    expect((req as NextApiRequest & { session: unknown }).session).toBe(
      mockSession,
    );
    expect(handler).toHaveBeenCalledWith(req, res);
    expect(result).toBe('handler-response');
  });
}
