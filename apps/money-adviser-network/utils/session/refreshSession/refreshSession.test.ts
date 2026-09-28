import { NextResponse } from 'next/server';

import { JWTHeaderParameters, JWTVerifyResult } from 'jose';
import { encrypt } from 'lib/token';

import { COOKIE_OPTIONS } from '../config';
import { getExpireTimeDate } from '../getExpireTimeDate';
import { refreshSession } from './refreshSession';

jest.mock('lib/token', () => ({
  encrypt: jest.fn(),
}));

jest.mock('../getExpireTimeDate', () => ({
  getExpireTimeDate: jest.fn(),
}));

describe('refreshSession', () => {
  const mockResponse = () => {
    const cookiesMap = new Map<string, unknown>();
    return {
      cookies: {
        set: jest.fn((name: string, value: unknown, options: unknown) => {
          cookiesMap.set(name, { value, options });
        }),
        get: jest.fn(),
      },
      _cookiesMap: cookiesMap,
    } as unknown as NextResponse;
  };

  const createSession = (): JWTVerifyResult<Record<string, unknown>> => ({
    payload: {
      userId: '123',
      expires: new Date().toISOString(),
      sessionRefreshTime: new Date().toISOString(),
    },
    protectedHeader: {} as JWTHeaderParameters,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SESSION_EXPIRY_TIME = '15'; // 15 minutes
    process.env.SESSION_REFRESH_TIME = '5'; // 5 minutes
  });

  it('sets a new session cookie with encrypted value', async () => {
    const response = mockResponse();
    const userSession = createSession();
    const fakeEncrypted = 'encrypted-session';
    const fakeExpireDate = new Date().toISOString();

    (encrypt as jest.Mock).mockResolvedValue(fakeEncrypted);
    (getExpireTimeDate as jest.Mock).mockReturnValue(fakeExpireDate);

    const result = await refreshSession(response, userSession);

    expect(result).toBe(response);

    expect(encrypt).toHaveBeenCalledWith({
      ...userSession.payload,
      expires: fakeExpireDate,
    });

    expect(getExpireTimeDate).toHaveBeenNthCalledWith(1, 15);
    expect(getExpireTimeDate).toHaveBeenNthCalledWith(2, 5);

    expect(response.cookies.set).toHaveBeenCalledWith(
      'session',
      fakeEncrypted,
      {
        ...COOKIE_OPTIONS,
        expires: fakeExpireDate,
      },
    );
  });
});
