import type { NextApiRequest, NextApiResponse } from 'next';

import {
  BETA_ACCESS_SEND_CODE_RATE_LIMITED,
  sendCode,
} from '../../lib/api/beta-access-control-service';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  if (process.env.MHPD_SECURE_BETA_ENABLED !== 'true') {
    response.status(200).json({ success: false, redirect: '/' });
    return;
  }

  const linkId = (request.query?.linkId ?? request.body?.linkId) as string;

  if (!linkId) {
    response.status(400).json({ success: false, error: 'missing-link-id' });
    return;
  }

  try {
    await sendCode(linkId);
    response.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to resend verification code:', error);
    if (
      error instanceof Error &&
      error.message === BETA_ACCESS_SEND_CODE_RATE_LIMITED
    ) {
      response.status(429).json({ success: false, error: 'too-many-attempts' });
      return;
    }
    response.status(500).json({ success: false, error: 'send-failed' });
  }
}
