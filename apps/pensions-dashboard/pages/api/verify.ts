import type { NextApiRequest, NextApiResponse } from 'next';

import { verifyCode } from '../../lib/api/beta-access-control-service';
import { COOKIE_OPTIONS } from '../../lib/constants';
import { VerifyCodeResponseCode } from '../../lib/types';
import { Cookies } from '../../lib/utils/system';

const handler = async (
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> => {
  if (process.env.MHPD_SECURE_BETA_ENABLED !== 'true') {
    response.status(200).json({ success: false, redirect: '/' });
    return;
  }

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ success: false, error: 'method-not-allowed' });
    return;
  }

  const cookies = new Cookies(request, response);
  const linkId = (request.body?.linkId ?? request.query?.linkId) as string;
  const code = (request.body?.code ?? '')
    .trim()
    .replaceAll(/\s/g, '') as string;

  if (!linkId) {
    response.status(400).json({ success: false, error: 'missing-link-id' });
    return;
  }

  if (!code) {
    response.status(400).json({ success: false, error: 'invalid' });
    return;
  }

  try {
    const verified = await verifyCode(linkId, code);

    // verifyCode only returns { token } when the service already returned success (0) with a token.
    if ('token' in verified) {
      cookies.set('beaconId', verified.token, {
        ...COOKIE_OPTIONS,
        maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
      });
      response.status(200).json({ success: true });
      return;
    }

    switch (verified.responseCode) {
      case VerifyCodeResponseCode.LINK_NOT_FOUND:
      case VerifyCodeResponseCode.LINK_HAS_EXPIRED:
      case VerifyCodeResponseCode.LINK_NOT_YET_ACTIVE:
        response.status(200).json({
          success: false,
          redirect: '/en/link-access-error',
        });
        return;
      case VerifyCodeResponseCode.INVALID_CODE:
        response.status(400).json({ success: false, error: 'invalid' });
        return;
      case VerifyCodeResponseCode.CODE_HAS_EXPIRED:
        response.status(400).json({ success: false, error: 'expired' });
        return;
      case VerifyCodeResponseCode.CODE_VALIDATION_BACK_OFF:
        response.status(400).json({
          success: false,
          error: 'too-many-attempts',
        });
        return;
      case VerifyCodeResponseCode.INVALID_REQUEST:
      default:
        response.status(400).json({ success: false, error: 'api-failure' });
        return;
    }
  } catch {
    response.status(400).json({
      success: false,
      error: 'api-failure',
    });
  }
};

export default handler;
