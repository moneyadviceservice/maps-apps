import { ResponseMessage } from '@maps-react/mhf/constants';
import {
  runSubmissionStateMachine,
  type SubmissionResult,
} from '@maps-react/mhf/submission';
import { Entry, EntryData } from '@maps-react/mhf/types';
import { buildFormPath, getCookieName } from '@maps-react/mhf/utils';
import { redisRestDel } from '@maps-react/redis/rest-client';
import { type Language } from '@maps-react/utils/language';

import { FLOW_VERSION, FORM_BASE_PATH, StepName } from '../../form/constants';
import { postQuestionnaireSubmission } from '../api/beacon-service';

export const BEACON_COOKIE_NAME = 'beaconId';
export const BEACON_COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

const TAKING_PART_SUBMISSION_KEY = 'taking-part-submit';
const CLEARED_COOKIE_EXPIRES = 'Thu, 01 Jan 1970 00:00:00 GMT';

type SetCookieResponse = {
  setHeader: (name: 'Set-Cookie', value: string[]) => void;
};

export const buildBeaconIdCookie = (): string =>
  `${BEACON_COOKIE_NAME}=; Path=/; Max-Age=${BEACON_COOKIE_MAX_AGE_SECONDS}; HttpOnly; Secure; SameSite=Lax`;

export const buildClearedSessionCookie = (cookieName: string): string =>
  `${cookieName}=; Path=/; Expires=${CLEARED_COOKIE_EXPIRES}; HttpOnly; Secure; SameSite=Lax`;

const errorLocation = (locale: Language): string =>
  buildFormPath(locale, StepName.ERROR, FORM_BASE_PATH);

const loadingLocation = (locale: Language): string =>
  buildFormPath(locale, StepName.LOADING, FORM_BASE_PATH);

type QuestionnairePayload = {
  locale: EntryData['locale'];
  questionnaireVersion: string;
  personalDetails: {
    firstName?: EntryData[string];
    lastName?: EntryData[string];
    emailAddress?: EntryData[string];
  };
  consent: {
    decision: 'agreed';
    version: string;
    timestamp: string;
  };
  answers: Record<string, EntryData[string]>;
};

const buildQuestionnairePayload = (entry: Entry): QuestionnairePayload => {
  const {
    locale,
    flow,
    termsAndConditions,
    firstName,
    lastName,
    emailAddress,
    ...remainingAnswers
  } = entry.data;

  const answers = Object.fromEntries(
    Object.entries(remainingAnswers).filter(
      ([, value]) => value !== '' && value !== undefined,
    ),
  );

  if (answers.yourSex !== 'other') {
    delete answers.otherSex;
  }

  if (answers.healthConditions !== 'yes') {
    delete answers.healthConditionsImpact;
  }

  return {
    locale,
    questionnaireVersion: FLOW_VERSION,
    personalDetails: {
      firstName,
      lastName,
      emailAddress,
    },
    consent: {
      decision: 'agreed',
      version: FLOW_VERSION,
      timestamp: new Date().toISOString(),
    },
    answers,
  };
};

const clearTakingPartSession = async (sessionKey: string): Promise<void> => {
  try {
    const deleted = await redisRestDel(sessionKey);
    if (!deleted.success) {
      console.warn(
        'Failed to clear taking-part session after Beacon success',
        deleted.error,
      );
    }
  } catch (error) {
    console.warn(
      'Failed to clear taking-part session after Beacon success',
      error,
    );
  }
};

const finishTakingPart = async (
  sessionKey: string,
  locale: Language,
  res: SetCookieResponse,
): Promise<SubmissionResult> => {
  await clearTakingPartSession(sessionKey);
  res.setHeader('Set-Cookie', [
    buildBeaconIdCookie(),
    buildClearedSessionCookie(getCookieName()),
  ]);

  return {
    redirect: {
      destination: `/${locale}`,
      permanent: false,
    },
  };
};

/**
 * Posts the stored taking-part session to Beacon through the shared submission state machine.
 * A fresh in-progress submission returns the loading path and does not post again.
 * A 200 sets a blank beaconId for 365 days, clears the temporary session, and returns the landing path.
 * Any other outcome returns the taking-part error path and does not set beaconId.
 */
export const submitTakingPart = async ({
  entry,
  sessionKey,
  locale,
  res,
}: {
  entry: Entry;
  sessionKey: string;
  locale: Language;
  res: SetCookieResponse;
}): Promise<SubmissionResult> =>
  runSubmissionStateMachine({
    entry,
    key: sessionKey,
    locale,
    submissionKey: TAKING_PART_SUBMISSION_KEY,
    loadingDestination: loadingLocation(locale),
    errorDestination: () => errorLocation(locale),
    resolveErrorStatus: () => ResponseMessage.SUBMISSION_FAILED,
    submit: async (storedEntry) => {
      await postQuestionnaireSubmission(buildQuestionnairePayload(storedEntry));
      return {};
    },
    onSuccess: (_storedEntry, key, storedLocale) =>
      finishTakingPart(key, storedLocale, res),
  });
