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
      'should set the channel cookie as %s',
      (channel) => {
        setDashboardChannel(
          { req, res } as GetServerSidePropsContext,
          channel as ChannelType,
        );
        expect(cookies.set).toHaveBeenCalledWith(
          'channel',
          channel,
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
    ])('should clear the channel cookie when channel is %s', (channel) => {
      setDashboardChannel(
        { req, res } as GetServerSidePropsContext,
        channel as ChannelType | undefined,
      );
      expect(cookies.set).toHaveBeenCalledWith('channel', '');
    });
  });

  describe('getDashboardChannel', () => {
    it.each([['CONFIRMED'], ['UNCONFIRMED'], ['INCOMPLETE']])(
      'should return the channel cookie as %s',
      (channel) => {
        cookies.get.mockReturnValue(channel);
        const result = getDashboardChannel({
          req,
          res,
        } as GetServerSidePropsContext);
        expect(result).toEqual({ channel });
      },
    );

    it('should return an empty string if the channel cookie is not set', () => {
      cookies.get.mockReturnValue(undefined);
      const result = getDashboardChannel({
        req,
        res,
      } as GetServerSidePropsContext);
      expect(result).toEqual({ channel: '' });
    });
  });
});
