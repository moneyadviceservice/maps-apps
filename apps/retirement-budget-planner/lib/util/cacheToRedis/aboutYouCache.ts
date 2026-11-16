import { PAGES_NAMES } from 'lib/constants/pageConstants';
import { type Partner } from 'lib/types/aboutYou';

import { redisRestGet, redisRestSet } from '@maps-react/redis/rest-client';

import { defaultPartner } from '../about-you';

export const getPartnersFromRedis = async (
  sessionId: string,
): Promise<Partner | null> => {
  if (!sessionId || sessionId.length === 0) return null;

  try {
    const getPartnerDetailsResponse = await redisRestGet(
      `${PAGES_NAMES.ABOUTYOU}:${sessionId}`,
    );

    if (!getPartnerDetailsResponse.success) {
      throw new Error(getPartnerDetailsResponse.error ?? 'Unknown error');
    }

    if (!getPartnerDetailsResponse?.data?.value) {
      return defaultPartner;
    }

    return JSON.parse(getPartnerDetailsResponse.data.value);
  } catch (error) {
    console.error('Error fetching partner details from Redis:', error);
    throw error;
  }
};

export const setPartnersInRedis = async (
  partner: Partner,
  sessionId: string,
) => {
  try {
    const setPartnerDetailsResponse = await redisRestSet(
      `${PAGES_NAMES.ABOUTYOU}:${sessionId}`,
      JSON.stringify(partner),
    );

    if (!setPartnerDetailsResponse.success) {
      throw new Error(setPartnerDetailsResponse.error ?? 'Unknown error');
    }
  } catch (error) {
    console.error('Error setting partner details in Redis:', error);
    throw error;
  }
};
