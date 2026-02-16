import { NextApiRequest, NextApiResponse } from 'next';

import { Partner } from 'lib/types/aboutYou';
import { setPartnersInRedis } from 'lib/util/cacheToRedis';
import { getSessionId } from 'lib/util/get-session-id';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const sessionId = getSessionId(req.body.sessionId);
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is missing' });
  }
  try {
    const partner: Partner = req.body.partner;

    if (!partner) {
      return res.status(400).json({ error: 'Invalid partner data format' });
    }

    await setPartnersInRedis(partner, sessionId);

    return res.status(200).json({ message: 'Partners synced successfully' });
  } catch (error) {
    console.error('Error syncing partners:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
