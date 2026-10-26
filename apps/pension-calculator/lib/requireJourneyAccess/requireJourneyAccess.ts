import type { Redirect } from 'next';

import { JOURNEY_PAGES, type JourneyPage } from 'data/journey';
import { getAboutYouFromSession } from 'lib/session/aboutYouSession';
import { getIncomeFromSession } from 'lib/session/incomeSession';
import {
  getIncomePensionsFromSession,
  getPensionsFromSession,
} from 'lib/session/pensionsSession';
import { hasAboutYouErrors, validateAboutYou } from 'lib/validation/aboutYou';
import {
  hasPensionErrors,
  validateIncomeScreening,
  validatePotScreening,
} from 'lib/validation/pensions';
import {
  hasYourIncomeErrors,
  validateYourIncome,
} from 'lib/validation/yourIncome';
import { journeyPath } from 'utils/journeyPath';

type JourneyAccess = {
  language: string;
  sessionId: string;
};

type JourneyAccessRedirect = {
  redirect: Redirect;
};

/** Pages that require a completed About you step before access. */
const requiresAboutYou = new Set<JourneyPage>([
  JOURNEY_PAGES.YOUR_INCOME,
  JOURNEY_PAGES.POTS_OF_MONEY,
  JOURNEY_PAGES.STATE_PENSION,
  JOURNEY_PAGES.RETIREMENT_INCOME,
  JOURNEY_PAGES.INCOME_PENSIONS,
  JOURNEY_PAGES.SAVE,
]);

/** Pages that also require a completed Your income step. */
const requiresIncome = new Set<JourneyPage>([
  JOURNEY_PAGES.POTS_OF_MONEY,
  JOURNEY_PAGES.INCOME_PENSIONS,
  JOURNEY_PAGES.STATE_PENSION,
  JOURNEY_PAGES.RETIREMENT_INCOME,
]);

/** Pages that require a completed Pots of money step. */
const requiresPotsOfMoney = new Set<JourneyPage>([
  JOURNEY_PAGES.INCOME_PENSIONS,
  JOURNEY_PAGES.STATE_PENSION,
  JOURNEY_PAGES.RETIREMENT_INCOME,
]);

/** Pages that require a completed Income pensions step. */
const requiresIncomePensions = new Set<JourneyPage>([
  JOURNEY_PAGES.STATE_PENSION,
  JOURNEY_PAGES.RETIREMENT_INCOME,
]);

const isAboutYouComplete = async (sessionId: string, language: string) => {
  const data = await getAboutYouFromSession(sessionId);
  if (!data) return false;
  return !hasAboutYouErrors(validateAboutYou(data, language));
};

const isIncomeComplete = async (sessionId: string, language: string) => {
  const data = await getIncomeFromSession(sessionId);
  return Boolean(
    data && !hasYourIncomeErrors(validateYourIncome(data, language)),
  );
};

const isPotsOfMoneyComplete = async (sessionId: string) => {
  const data = await getPensionsFromSession(sessionId);
  return Boolean(data && !hasPensionErrors(validatePotScreening(data)));
};

const isIncomePensionsComplete = async (sessionId: string) => {
  const data = await getIncomePensionsFromSession(sessionId);
  return Boolean(data && !hasPensionErrors(validateIncomeScreening(data)));
};

export const requireJourneyAccess = async ({
  page,
  language,
  sessionId,
}: {
  page: JourneyPage;
  language: string;
  sessionId: string;
}): Promise<JourneyAccess | JourneyAccessRedirect> => {
  if (!requiresAboutYou.has(page)) {
    return { language, sessionId };
  }

  const aboutYouComplete = await isAboutYouComplete(sessionId, language);
  if (!aboutYouComplete) {
    return {
      redirect: {
        destination: journeyPath(language, JOURNEY_PAGES.ABOUT_YOU, sessionId),
        permanent: false,
      },
    };
  }

  if (requiresIncome.has(page)) {
    const incomeComplete = await isIncomeComplete(sessionId, language);
    if (!incomeComplete) {
      return {
        redirect: {
          destination: journeyPath(
            language,
            JOURNEY_PAGES.YOUR_INCOME,
            sessionId,
          ),
          permanent: false,
        },
      };
    }
  }

  if (requiresPotsOfMoney.has(page)) {
    const potsOfMoneyComplete = await isPotsOfMoneyComplete(sessionId);
    if (!potsOfMoneyComplete) {
      return {
        redirect: {
          destination: journeyPath(
            language,
            JOURNEY_PAGES.POTS_OF_MONEY,
            sessionId,
          ),
          permanent: false,
        },
      };
    }
  }

  if (requiresIncomePensions.has(page)) {
    const incomePensionsComplete = await isIncomePensionsComplete(sessionId);
    if (!incomePensionsComplete) {
      return {
        redirect: {
          destination: journeyPath(
            language,
            JOURNEY_PAGES.INCOME_PENSIONS,
            sessionId,
          ),
          permanent: false,
        },
      };
    }
  }

  return { language, sessionId };
};
