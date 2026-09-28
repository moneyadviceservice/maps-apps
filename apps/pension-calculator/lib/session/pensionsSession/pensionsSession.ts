import {
  getJourneySession,
  updateJourneySession,
} from 'lib/session/journeySession';
import type { PotsOfMoneyData } from 'types/pensions';
import { ensurePensionsDefaults } from 'utils/parsePensionsForm';

export const getPensionsFromSession = async (sessionId: string) => {
  const session = await getJourneySession(sessionId);
  return session.potsOfMoney
    ? ensurePensionsDefaults(session.potsOfMoney)
    : null;
};
export const savePensionsToSession = async (
  sessionId: string,
  data: PotsOfMoneyData,
) => updateJourneySession(sessionId, { potsOfMoney: data });
