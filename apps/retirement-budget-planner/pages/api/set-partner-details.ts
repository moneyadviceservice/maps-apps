import { NextApiRequest, NextApiResponse } from 'next';

import { Partner } from 'lib/types/aboutYou';

import { redisSet } from '@maps-react/redis/helpers';

export const setPartnersInRedis = async (
  partners: Partner[],
  sessionId: string,
) => {
  try {
    await redisSet(`aboutYou:${sessionId}`, JSON.stringify(partners), 1800);
  } catch (error) {
    console.error('Error setting partner details in Redis:', error);
    throw error;
  }
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const sessionId = req.cookies?.session_id;
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is missing' });
  }
  try {
    const partners: Partner[] = req.body;

    if (!Array.isArray(partners)) {
      return res.status(400).json({ error: 'Invalid partner data format' });
    }

    await setPartnersInRedis(partners, sessionId);

    return res.status(200).json({ message: 'Partners synced successfully' });
  } catch (error) {
    console.error('Error syncing partners:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
