import type { NextApiRequest, NextApiResponse } from 'next';

import {
  BETA_ACCESS_SEND_CODE_RATE_LIMITED,
  sendCode,
  verifyCode,
} from '../../lib/api/beta-access-control-service';
import { COOKIE_OPTIONS, DAYS_90 } from '../../lib/constants';
import { VerifyCodeResponseCode } from '../../lib/types';
import { Cookies } from '../../lib/utils/system';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  if (process.env.MHPD_SECURE_BETA_ENABLED !== 'true') {
    response.redirect(302, '/');
    return;
  }

  const linkId = request.query.linkId as string;
  const beaconId = request.cookies?.beaconId;

  if (beaconId) {
    response.redirect(302, '/');
    return;
  }

  if (!linkId) {
    response.redirect(302, '/en/link-access-error');
    return;
  }

  try {
    const verifyResponse = await verifyCode(linkId);
    if (
      'responseCode' in verifyResponse &&
      (verifyResponse.responseCode === VerifyCodeResponseCode.LINK_NOT_FOUND ||
        verifyResponse.responseCode ===
          VerifyCodeResponseCode.LINK_HAS_EXPIRED ||
        verifyResponse.responseCode ===
          VerifyCodeResponseCode.LINK_NOT_YET_ACTIVE ||
        verifyResponse.responseCode ===
          VerifyCodeResponseCode.LEGACY_LINK_ALREADY_USED)
    ) {
      response.redirect(302, '/en/link-access-error');
      return;
    }

    if ('token' in verifyResponse) {
      const cookies = new Cookies(request, response);
      cookies.set('beaconId', verifyResponse.token, {
        ...COOKIE_OPTIONS,
        maxAge: DAYS_90,
      });
      response.redirect(302, '/');
      return;
    }
  } catch (error) {
    console.error('Failed to verify code:', error);
    response.redirect(302, '/en/link-access-error');
    return;
  }

  try {
    await sendCode(linkId);
  } catch (error) {
    console.error('Failed to send verification code to user:', error);
    if (
      error instanceof Error &&
      error.message === BETA_ACCESS_SEND_CODE_RATE_LIMITED
    ) {
      response.redirect(
        302,
        `/en/verify-code?linkId=${encodeURIComponent(
          linkId,
        )}&sendError=too-many-attempts`,
      );
      return;
    }
    response.redirect(302, '/en/link-access-error');
    return;
  }

  response.redirect(
    302,
    `/en/verify-code?linkId=${encodeURIComponent(linkId)}`,
  );
}
