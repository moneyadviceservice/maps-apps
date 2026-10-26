import { GetServerSidePropsContext } from 'next';

import { redirectToLogin } from './redirectToLogin';

describe('redirectToLogin', () => {
  it('returns redirect with destination using resolvedUrl', () => {
    const context = {
      resolvedUrl: '/admin/dashboard',
      req: {},
      res: {},
    } as GetServerSidePropsContext;

    const result = redirectToLogin(context);

    expect(result).toEqual({
      redirect: {
        destination: '/api/auth/signin?redirectTo=%2Fadmin%2Fdashboard',
        permanent: false,
      },
    });
  });

  it('uses "/" when resolvedUrl is undefined', () => {
    const context = { req: {}, res: {} } as GetServerSidePropsContext;

    const result = redirectToLogin(context);

    expect(result).toEqual({
      redirect: {
        destination: '/api/auth/signin?redirectTo=%2F',
        permanent: false,
      },
    });
  });

  it('encodes redirectTo in destination', () => {
    const context = {
      resolvedUrl: '/path?foo=bar&baz=qux',
      req: {},
      res: {},
    } as GetServerSidePropsContext;

    const result = redirectToLogin(context);

    expect(result).toHaveProperty('redirect');
    expect(
      (result as { redirect: { destination: string } }).redirect.destination,
    ).toContain(encodeURIComponent('/path?foo=bar&baz=qux'));
    expect(
      (result as { redirect: { permanent: boolean } }).redirect.permanent,
    ).toBe(false);
  });
});
