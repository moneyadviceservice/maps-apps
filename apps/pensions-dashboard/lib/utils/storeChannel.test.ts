import { GetServerSidePropsContext } from 'next';

import Cookies from 'cookies';
import { IncomingMessage, ServerResponse } from 'http';

import {
  ChannelType,
  getDashboardChannel,
  setDashboardChannel,
} from './storeChannel';

jest.mock('cookies');

describe('storeChannel', () => {
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
  });

  describe('setDashboardChannel', () => {
    it.each([['CONFIRMED'], ['UNCONFIRMED'], ['INCOMPLETE']])(
      'should set the channel in consolidated cookie as %s',
      (channel) => {
        // Mock existing session config
        cookies.get.mockReturnValue(
          JSON.stringify({
            authorizationCode: 'auth123',
            userSessionId: 'session123',
            redirectUrl: '/redirect',
            currentUrl: '/current',
            supportCurrentUrl: '/support',
            channel: '',
            pensionID: 'pension123',
            sessionTimeout: '3600',
          }),
        );

        setDashboardChannel(
          { req, res } as GetServerSidePropsContext,
          channel as ChannelType,
        );

        expect(cookies.set).toHaveBeenCalledWith(
          'mhpdSessionConfig',
          expect.stringContaining(`"channel":"${channel}"`),
          expect.any(Object),
        );
      },
    );

    it.each([
      ['NONE'],
      [undefined],
      [null],
      [false],
      ['provided an unknown type'],
    ])(
      'should clear the channel in consolidated cookie when channel is %s',
      (channel) => {
        // Mock existing session config
        cookies.get.mockReturnValue(
          JSON.stringify({
            authorizationCode: 'auth123',
            userSessionId: 'session123',
            redirectUrl: '/redirect',
            currentUrl: '/current',
            supportCurrentUrl: '/support',
            channel: 'CONFIRMED',
            pensionID: 'pension123',
            sessionTimeout: '3600',
          }),
        );

        setDashboardChannel(
          { req, res } as GetServerSidePropsContext,
          channel as ChannelType | undefined,
        );

        expect(cookies.set).toHaveBeenCalledWith(
          'mhpdSessionConfig',
          expect.stringContaining(`"channel":""`),
          expect.any(Object),
        );
      },
    );
  });

  describe('getDashboardChannel', () => {
    it.each([['CONFIRMED'], ['UNCONFIRMED'], ['INCOMPLETE']])(
      'should return the channel from consolidated cookie as %s',
      (channel) => {
        cookies.get.mockReturnValue(
          JSON.stringify({
            authorizationCode: 'auth123',
            userSessionId: 'session123',
            redirectUrl: '/redirect',
            currentUrl: '/current',
            supportCurrentUrl: '/support',
            channel: channel,
            pensionID: 'pension123',
            sessionTimeout: '3600',
          }),
        );

        const result = getDashboardChannel({
          req,
          res,
        } as GetServerSidePropsContext);
        expect(result).toEqual({ channel });
      },
    );

    it('should return an empty string if no consolidated cookie exists', () => {
      cookies.get.mockReturnValue(undefined);
      const result = getDashboardChannel({
        req,
        res,
      } as GetServerSidePropsContext);
      expect(result).toEqual({ channel: '' });
    });
  });
});
