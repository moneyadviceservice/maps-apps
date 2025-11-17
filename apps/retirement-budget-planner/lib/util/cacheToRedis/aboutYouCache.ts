import { Partner } from 'lib/types/aboutYou';

import { redisGet, redisSet } from '@maps-react/redis/helpers';

import { partners } from '../about-you';

export const getPartnersFromRedis = async (sessionId: string) => {
  if (!sessionId || sessionId.length === 0) return null;

  try {
    const partnerDetails = await redisGet(`aboutYou:${sessionId}`);

    if (!partnerDetails) {
      return partners;
    }

    return JSON.parse(partnerDetails);
  } catch (error) {
    console.error('Error fetching partner details from Redis:', error);
    throw new Error(String(error));
  }
};

export const setPartnersInRedis = async (
  partners: Partner[],
  sessionId: string,
) => {
  try {
    await redisSet(`aboutYou:${sessionId}`, JSON.stringify(partners));
  } catch (error) {
    console.error('Error setting partner details in Redis:', error);
    throw error;
  }
};
