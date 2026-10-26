import {
  getJourneySession,
  updateJourneySession,
} from 'lib/session/journeySession';
import type { StatePensionData } from 'types/statePension';

export const getStatePensionFromSession = async (
  sessionId: string,
): Promise<StatePensionData | null> => {
  const session = await getJourneySession(sessionId);
  if (!session.statePension) {
    return null;
  }

  return {
    weeklyAmount: session.statePension.weeklyAmount ?? '',
  };
};

export const saveStatePensionToSession = async (
  sessionId: string,
  data: StatePensionData,
): Promise<void> => {
  await updateJourneySession(sessionId, { statePension: data });
};
