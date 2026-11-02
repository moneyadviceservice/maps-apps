import {
  getJourneySession,
  updateJourneySession,
} from 'lib/session/journeySession';
import type { YourIncomeData } from 'types/income';
import { ensureYourIncomeDefaults } from 'utils/parseYourIncomeForm';

export const getIncomeFromSession = async (
  sessionId: string,
): Promise<YourIncomeData | null> => {
  const session = await getJourneySession(sessionId);
  if (!session.income) {
    return null;
  }

  return ensureYourIncomeDefaults(session.income);
};

export const saveIncomeToSession = async (
  sessionId: string,
  data: YourIncomeData,
): Promise<void> => {
  await updateJourneySession(sessionId, { income: data });
};
