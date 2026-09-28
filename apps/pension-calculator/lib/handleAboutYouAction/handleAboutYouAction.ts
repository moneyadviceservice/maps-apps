import { JOURNEY_PAGES, type JourneyAction } from 'data/journey';
import { saveAboutYouToSession } from 'lib/session/aboutYouSession';
import { hasAboutYouErrors, validateAboutYou } from 'lib/validation/aboutYou';
import type { AboutYouData, AboutYouErrors } from 'types/aboutYou';
import { journeyPath } from 'utils/journeyPath';
import { parseAboutYouForm } from 'utils/parseAboutYouForm';

export type AboutYouAction = JourneyAction;

type HandleAboutYouResult = {
  data: AboutYouData;
  errors: AboutYouErrors;
  redirectPath: string;
  valid: boolean;
};

export const handleAboutYouAction = async ({
  action,
  body,
  language,
  sessionId,
}: {
  action: AboutYouAction;
  body: Record<string, unknown>;
  language: string;
  sessionId: string;
}): Promise<HandleAboutYouResult> => {
  const data = parseAboutYouForm(body);
  let errors: AboutYouErrors = {};
  let valid = true;
  let redirectPath: string;

  switch (action) {
    case 'save': {
      redirectPath = journeyPath(language, JOURNEY_PAGES.SAVE, sessionId);
      break;
    }
    case 'continue': {
      errors = validateAboutYou(data, language);
      valid = !hasAboutYouErrors(errors);
      redirectPath = valid
        ? journeyPath(language, JOURNEY_PAGES.YOUR_INCOME, sessionId)
        : journeyPath(language, JOURNEY_PAGES.ABOUT_YOU, sessionId, {
            error: 'true',
          });
      break;
    }
  }

  await saveAboutYouToSession(sessionId, data);

  return { data, errors, redirectPath, valid };
};
