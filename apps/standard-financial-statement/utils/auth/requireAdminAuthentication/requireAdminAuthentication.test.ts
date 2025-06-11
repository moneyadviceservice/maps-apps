import type { GetServerSidePropsContext } from 'next';

import { getIronSession, IronSession } from 'iron-session';
import { ParsedUrlQuery } from 'querystring';

import { requireAdminAuthentication } from './requireAdminAuthentication';

jest.mock('iron-session', () => ({
  getIronSession: jest.fn(),
}));

const mockGetIronSession = getIronSession as jest.MockedFunction<
  typeof getIronSession
>;

describe('requireAdminAuthentication', () => {
  const createMockContext = (
    overrides: Partial<GetServerSidePropsContext> = {},
  ): GetServerSidePropsContext => {
    const req = {} as GetServerSidePropsContext['req'];
    const res = {} as GetServerSidePropsContext['res'];
    const query: ParsedUrlQuery = {};

    return {
      req,
      res,
      resolvedUrl: '/protected',
      query,
      ...overrides,
    };
  };

  it('redirects if not authenticated', async () => {
    mockGetIronSession.mockResolvedValueOnce({
      isAuthenticated: false,
    } as unknown as IronSession<object>);

    const context = createMockContext();
    const result = await requireAdminAuthentication(context);

    expect(result).toEqual({
      redirect: {
        destination: '/api/auth/signin?redirectTo=%2Fprotected',
        permanent: false,
      },
    });
  });

  it('redirects if no account info', async () => {
    mockGetIronSession.mockResolvedValueOnce({
      isAuthenticated: true,
      account: null,
    } as unknown as IronSession<object>);

    const context = createMockContext();
    const result = await requireAdminAuthentication(context);

    expect(result).toEqual({
      redirect: {
        destination: '/api/auth/signin?redirectTo=%2Fprotected',
        permanent: false,
      },
    });
  });

  it('redirects to custom redirectTo if provided', async () => {
    mockGetIronSession.mockResolvedValueOnce({
      isAuthenticated: false,
    } as unknown as IronSession<object>);

    const context = createMockContext({ resolvedUrl: '/default' });
    const result = await requireAdminAuthentication(context, '/custom-path');

    expect(result).toEqual({
      redirect: {
        destination: '/api/auth/signin?redirectTo=%2Fcustom-path',
        permanent: false,
      },
    });
  });

  it('redirects to admin if authenticated but not admin', async () => {
    mockGetIronSession.mockResolvedValueOnce({
      isAuthenticated: true,
      account: {
        homeAccountId: 'abc',
      },
    } as unknown as IronSession<object>);

    const context = createMockContext();
    const result = await requireAdminAuthentication(context);

    expect(result).toEqual({
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    });
  });

  it('returns session if authenticated and has account', async () => {
    const mockSession = {
      isAuthenticated: true,
      account: {
        homeAccountId: 'abc',
        idTokenClaims: { roles: ['sfs_admin'] },
      },
    };

    mockGetIronSession.mockResolvedValueOnce(
      mockSession as unknown as IronSession<object>,
    );

    const context = createMockContext();
    const result = await requireAdminAuthentication(context);

    expect(result).toEqual({ session: mockSession });
  });
});
