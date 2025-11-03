import { NextApiRequest, NextApiResponse } from 'next';

import { Partner } from 'lib/types/aboutYou';
import { getPartnersFromRedis } from 'lib/util/cacheToRedis/aboutYouCache';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const sessionId = req.body.sessionId || req.query.sessionId;
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is missing' });
  }
  try {
    const partnerDetails: Partner[] = await getPartnersFromRedis(sessionId);
    return res.status(200).json(partnerDetails);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'No partner details found'
    ) {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error fetching partner details:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
