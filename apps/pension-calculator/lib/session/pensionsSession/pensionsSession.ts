import {
  getJourneySession,
  updateJourneySession,
} from 'lib/session/journeySession';
import type { DefinedIncomeData, PotsOfMoneyData } from 'types/pensions';
import {
  ensureIncomePensionsDefaults,
  ensurePensionsDefaults,
} from 'utils/parsePensionsForm';

export const getPensionsFromSession = async (sessionId: string) => {
  const session = await getJourneySession(sessionId);
  return session.potsOfMoney
    ? ensurePensionsDefaults(session.potsOfMoney)
    : null;
};

export const getIncomePensionsFromSession = async (sessionId: string) => {
  const session = await getJourneySession(sessionId);
  return session.incomePensions
    ? ensureIncomePensionsDefaults(session.incomePensions)
    : null;
};

export const savePensionsToSession = async (
  sessionId: string,
  data: PotsOfMoneyData,
) => updateJourneySession(sessionId, { potsOfMoney: data });

export const saveIncomePensionsToSession = async (
  sessionId: string,
  data: DefinedIncomeData,
) => updateJourneySession(sessionId, { incomePensions: data });
