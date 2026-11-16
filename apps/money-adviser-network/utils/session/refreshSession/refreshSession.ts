import { NextResponse } from 'next/server';

import { JWTVerifyResult } from 'jose';
import { encrypt } from 'lib/token';

import { COOKIE_OPTIONS } from '../config';
import { getExpireTimeDate } from '../getExpireTimeDate';

export const refreshSession = async (
  response: NextResponse,
  userSession: JWTVerifyResult<Record<string, unknown>>,
): Promise<NextResponse> => {
  const SESSION_EXPIRY_TIME_MINUTES = Number(process.env.SESSION_EXPIRY_TIME);
  const newSessionExpiryTimeMs = getExpireTimeDate(SESSION_EXPIRY_TIME_MINUTES);
  const SESSION_REFRESH_TIME_MINUTES = Number(process.env.SESSION_REFRESH_TIME);
  const newSessionRefreshTimeMs = getExpireTimeDate(
    SESSION_REFRESH_TIME_MINUTES,
  );

  const newSession = await encrypt({
    ...userSession.payload,
    expires: newSessionExpiryTimeMs, // Must be less than sessionExpireTime or the cookie will be gone before refresh can occur
    sessionRefreshTime: newSessionRefreshTimeMs,
  });

  response.cookies.set('session', newSession, {
    ...COOKIE_OPTIONS,
    expires: newSessionExpiryTimeMs,
  });

  return response;
};
