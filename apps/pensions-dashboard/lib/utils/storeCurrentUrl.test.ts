import { GetServerSidePropsContext } from 'next';

import Cookies from 'cookies';
import { IncomingMessage, ServerResponse } from 'http';

import { storeCurrentUrl } from './storeCurrentUrl';

jest.mock('cookies');

describe('storeCurrentUrl', () => {
  let req: Partial<GetServerSidePropsContext['req']>;
  let res: Partial<GetServerSidePropsContext['res']>;
  let cookies: jest.Mocked<Cookies>;

  beforeEach(() => {
    req = {};
    res = {};
    cookies = new Cookies(
      req as IncomingMessage,
      res as ServerResponse,
    ) as jest.Mocked<Cookies>;
    (Cookies as unknown as jest.Mock).mockImplementation(() => cookies);
    cookies.get.mockReturnValue(undefined);
  });

  it('should set the currentUrl in consolidated cookie and return the backLink and currentUrl', () => {
    const mockSessionConfig = {
      authorizationCode: 'auth123',
      userSessionId: 'session123',
      redirectUrl: '/redirect',
      currentUrl: '/previous-page',
      supportCurrentUrl: '/support',
      channel: 'CONFIRMED',
      pensionID: 'pension123',
      sessionTimeout: '3600',
    };

    cookies.get.mockReturnValue(JSON.stringify(mockSessionConfig));

    const resolvedUrl = '/en/page';
    const result = storeCurrentUrl({
      req,
      res,
      resolvedUrl,
    } as GetServerSidePropsContext);

    expect(cookies.get).toHaveBeenCalledWith('mhpdSessionConfig');
    expect(cookies.set).toHaveBeenCalledWith(
      'mhpdSessionConfig',
      expect.stringContaining('"currentUrl":"/page"'),
      expect.any(Object),
    );
    expect(result).toEqual({
      backLink: '/previous-page',
      currentUrl: '/page',
    });
  });

  it.each`
    url                    | expectedResult
    ${''}                  | ${'/'}
    ${'/'}                 | ${'/'}
    ${'/en'}               | ${'/'}
    ${'/en/page'}          | ${'/page'}
    ${'/en/page/sub-page'} | ${'/page/sub-page'}
  `(
    'should return "$expectedResult" when given "$url"',
    ({ url, expectedResult }) =>
      ((resolvedUrl: string, expectedCurrentUrl: string) => {
        const result = storeCurrentUrl({
          req,
          res,
          resolvedUrl,
        } as GetServerSidePropsContext);

        expect(result).toEqual({
          backLink: null,
          currentUrl: expectedCurrentUrl,
        });
      })(url, expectedResult),
  );

  it('should set the supportCurrentUrl in consolidated cookie when isSupport is true', () => {
    const resolvedUrl = '/en/support-page';
    storeCurrentUrl(
      {
        req,
        res,
        resolvedUrl,
      } as GetServerSidePropsContext,
      true,
    );

    expect(cookies.set).toHaveBeenCalledWith(
      'mhpdSessionConfig',
      expect.stringContaining('"supportCurrentUrl":"/support-page"'),
      expect.any(Object),
    );
  });

  it('should clear the supportCurrentUrl in consolidated cookie when isSupport is false', () => {
    const resolvedUrl = '/en/page';
    storeCurrentUrl({
      req,
      res,
      resolvedUrl,
    } as GetServerSidePropsContext);

    expect(cookies.set).toHaveBeenCalledWith(
      'mhpdSessionConfig',
      expect.stringContaining('"supportCurrentUrl":""'),
      expect.any(Object),
    );
  });
});
