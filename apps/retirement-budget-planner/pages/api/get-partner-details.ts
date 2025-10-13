import { NextApiRequest, NextApiResponse } from 'next';

import { Partner } from 'lib/types/aboutYou';
import { partners } from 'lib/util/about-you';

import { redisGet } from '@maps-react/redis/helpers';
export const getPartnersFromRedis = async (sessionId: string) => {
  try {
    const partnerDetails = await redisGet(`aboutYou:${sessionId}`);
    if (!partnerDetails) {
      return partners;
    }

    return JSON.parse(partnerDetails);
  } catch (error) {
    console.error('Error fetching partner details from Redis:', error);
    throw error;
  }
};
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
