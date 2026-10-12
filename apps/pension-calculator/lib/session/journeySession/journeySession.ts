import type { JourneySessionData } from 'types/journeySession';

const journeySessionKey = (sessionId: string) =>
  `pension-calculator:${sessionId}`;

export const getJourneySession = async (
  sessionId: string,
): Promise<JourneySessionData> => {
  const { redisRestGet } = await import('@maps-react/redis/rest-client');

  try {
    const result = await redisRestGet(journeySessionKey(sessionId));
    if (!result.success || !result.data?.value) {
      return {};
    }

    return JSON.parse(result.data.value) as JourneySessionData;
  } catch (error) {
    console.warn('Failed to load journey session', error);
    return {};
  }
};

export const saveJourneySession = async (
  sessionId: string,
  data: JourneySessionData,
): Promise<void> => {
  const { redisRestSet } = await import('@maps-react/redis/rest-client');

  try {
    const result = await redisRestSet(
      journeySessionKey(sessionId),
      JSON.stringify(data),
    );
    if (!result.success) {
      throw new Error(result.error ?? 'Failed to save journey session');
    }
  } catch (error) {
    console.warn('Failed to save journey session', error);
    throw error;
  }
};

export const updateJourneySession = async (
  sessionId: string,
  patch: JourneySessionData,
): Promise<JourneySessionData> => {
  const current = await getJourneySession(sessionId);
  const next = { ...current, ...patch };
  await saveJourneySession(sessionId, next);
  return next;
};
