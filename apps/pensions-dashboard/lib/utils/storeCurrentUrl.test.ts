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

  it('should set the currentUrl cookie and return the backLink and currentUrl', () => {
    cookies.get.mockReturnValue('/previous-page');
    const resolvedUrl = '/en/page';
    const result = storeCurrentUrl({
      req,
      res,
      resolvedUrl,
    } as GetServerSidePropsContext);

    expect(cookies.get).toHaveBeenCalledWith('currentUrl');
    expect(cookies.set).toHaveBeenCalledWith(
      'currentUrl',
      '/page',
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

  it('should set the supportCurrentUrl cookie when isSupport is true', () => {
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
      'supportCurrentUrl',
      '/support-page',
      expect.any(Object),
    );
  });

  it('should clear the supportCurrentUrl cookie when isSupport is false', () => {
    const resolvedUrl = '/en/page';
    storeCurrentUrl({
      req,
      res,
      resolvedUrl,
    } as GetServerSidePropsContext);

    expect(cookies.set).toHaveBeenCalledWith('supportCurrentUrl', '');
  });
});
