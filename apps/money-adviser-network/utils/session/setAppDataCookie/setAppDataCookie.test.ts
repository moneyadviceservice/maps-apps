import { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';
import { decrypt, encrypt } from 'lib/token';
import { FLOW } from 'utils/getQuestions';

import { COOKIE_OPTIONS } from '../config';
import { setAppDataCookie } from './setAppDataCookie';

jest.mock('lib/token', () => ({
  decrypt: jest.fn(),
  encrypt: jest.fn(),
}));

jest.mock('cookies');

describe('setAppDataCookie', () => {
  const mockReq = {} as NextApiRequest;
  const mockRes = {} as NextApiResponse;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets a new cookie when none exists', async () => {
    const mockCookiesSet = jest.fn();
    (Cookies as unknown as jest.Mock).mockImplementation(() => ({
      get: jest.fn().mockReturnValue(undefined),
      set: mockCookiesSet,
    }));

    const testValue = { foo: { bar: 'baz' } };
    const encryptedValue = 'encrypted';
    (encrypt as jest.Mock).mockResolvedValue(encryptedValue);

    const result = await setAppDataCookie(
      mockReq,
      mockRes,
      'myCookie',
      testValue,
    );

    expect(encrypt).toHaveBeenCalledWith(testValue);

    expect(mockCookiesSet).toHaveBeenCalledWith(
      'myCookie',
      encryptedValue,
      COOKIE_OPTIONS,
    );

    expect(result).toEqual(testValue);
  });

  it('merges with existing cookie without flow', async () => {
    const mockCookiesSet = jest.fn();
    const existingCookie = 'encryptedExisting';
    const decryptedValue = { existing: { key: 'value' } };

    (Cookies as unknown as jest.Mock).mockImplementation(() => ({
      get: jest.fn().mockReturnValue(existingCookie),
      set: mockCookiesSet,
    }));

    (decrypt as jest.Mock).mockResolvedValue({ payload: decryptedValue });
    (encrypt as jest.Mock).mockResolvedValue('newEncrypted');

    const newValue = { additional: { key2: 'value2' } };

    const result = await setAppDataCookie(
      mockReq,
      mockRes,
      'myCookie',
      newValue,
    );

    expect(encrypt).toHaveBeenCalledWith({ ...decryptedValue, ...newValue });
    expect(mockCookiesSet).toHaveBeenCalledWith(
      'myCookie',
      'newEncrypted',
      COOKIE_OPTIONS,
    );
    expect(result).toEqual({ ...decryptedValue, ...newValue });
  });

  it('merges with existing cookie with flow', async () => {
    const mockCookiesSet = jest.fn();
    const existingCookie = 'encryptedExisting';
    const decryptedValue = { telephone: { a: { 1: '' }, b: { 2: '' } } };

    (Cookies as unknown as jest.Mock).mockImplementation(() => ({
      get: jest.fn().mockReturnValue(existingCookie),
      set: mockCookiesSet,
    }));

    (decrypt as jest.Mock).mockResolvedValue({ payload: decryptedValue });
    (encrypt as jest.Mock).mockResolvedValue('newEncrypted');

    const newValue = { b: { 3: '' }, c: { 4: '' } };

    const result = await setAppDataCookie(
      mockReq,
      mockRes,
      'myCookie',
      newValue,
      FLOW.TELEPHONE,
    );

    expect(encrypt).toHaveBeenCalledWith({
      ...decryptedValue,
      telephone: { ...decryptedValue.telephone, ...newValue },
    });

    expect(mockCookiesSet).toHaveBeenCalledWith(
      'myCookie',
      'newEncrypted',
      COOKIE_OPTIONS,
    );
    expect(result).toEqual({
      ...decryptedValue,
      telephone: { ...decryptedValue.telephone, ...newValue },
    });
  });
});
