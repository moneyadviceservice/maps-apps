import { JOURNEY_PAGES, type JourneyAction } from 'data/journey';
import { getMaxWeeklyAmount } from 'lib/api/ev/stateBenefit';
import { saveStatePensionToSession } from 'lib/session/statePensionSession';
import {
  hasStatePensionErrors,
  validateStatePension,
} from 'lib/validation/statePension';
import type { StatePensionData, StatePensionErrors } from 'types/statePension';
import { journeyPath } from 'utils/journeyPath';
import { parseStatePensionForm } from 'utils/parseStatePensionForm';

type Result = {
  data: StatePensionData;
  errors: StatePensionErrors;
  redirectPath: string;
  valid: boolean;
};

export const handleStatePensionAction = async ({
  action,
  body,
  language,
  sessionId,
}: {
  action: JourneyAction;
  body: Record<string, unknown>;
  language: string;
  sessionId: string;
}): Promise<Result> => {
  const data = parseStatePensionForm(body);
  const maxWeeklyAmount = await getMaxWeeklyAmount();
  const errors = validateStatePension(data, maxWeeklyAmount, language);
  const valid = !hasStatePensionErrors(errors);
  const redirectPath = !valid
    ? journeyPath(language, JOURNEY_PAGES.STATE_PENSION, sessionId, {
        error: 'true',
      })
    : journeyPath(
        language,
        action === 'save'
          ? JOURNEY_PAGES.SAVE
          : JOURNEY_PAGES.RETIREMENT_INCOME,
        sessionId,
      );

  await saveStatePensionToSession(sessionId, data);

  return { data, errors, redirectPath, valid };
};
