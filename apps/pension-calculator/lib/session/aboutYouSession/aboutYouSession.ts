import {
  getJourneySession,
  updateJourneySession,
} from 'lib/session/journeySession';
import type { AboutYouData } from 'types/aboutYou';
import { ensureAboutYouDefaults } from 'utils/parseAboutYouForm';

export const getAboutYouFromSession = async (
  sessionId: string,
): Promise<AboutYouData | null> => {
  const session = await getJourneySession(sessionId);
  if (!session.aboutYou) {
    return null;
  }

  return ensureAboutYouDefaults(session.aboutYou);
};

export const saveAboutYouToSession = async (
  sessionId: string,
  data: AboutYouData,
): Promise<void> => {
  await updateJourneySession(sessionId, { aboutYou: data });
};
