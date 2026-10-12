import { JOURNEY_PAGES, type JourneyAction } from 'data/journey';
import { savePensionsToSession } from 'lib/session/pensionsSession';
import {
  hasPensionErrors,
  validateContributions,
  validatePotDetails,
  validatePotScreening,
} from 'lib/validation/pensions';
import type { PotsOfMoneyData, PotsOfMoneyErrors } from 'types/pensions';
import { addPot, removePot } from 'utils/dcPotRows';
import { journeyPath } from 'utils/journeyPath';
import { parsePensionsForm } from 'utils/parsePensionsForm';
import { potNameId } from 'utils/pensionFieldIds';

export type PensionStep = 'screening' | 'details' | 'contributions';
export type PensionsAction = JourneyAction | 'add' | 'remove' | 'update';
type Result = {
  data: PotsOfMoneyData;
  errors: PotsOfMoneyErrors;
  redirectPath: string;
  valid: boolean;
};

const pageForStep = (step: PensionStep) => {
  if (step === 'details') return JOURNEY_PAGES.POT_DETAILS;
  if (step === 'contributions') return JOURNEY_PAGES.POT_CONTRIBUTIONS;
  return JOURNEY_PAGES.POTS_OF_MONEY;
};

const getStepValidationErrors = (
  step: PensionStep,
  data: PotsOfMoneyData,
): PotsOfMoneyErrors => {
  if (step === 'screening') return validatePotScreening(data);
  if (step === 'details') return validatePotDetails(data);
  return validateContributions(data);
};

const getContinueRedirectPath = (
  step: PensionStep,
  data: PotsOfMoneyData,
  language: string,
  sessionId: string,
) => {
  if (step === 'screening') {
    return data.hasPotOfMoneyPension === 'no'
      ? journeyPath(language, JOURNEY_PAGES.INCOME_PENSIONS, sessionId)
      : journeyPath(language, JOURNEY_PAGES.POT_DETAILS, sessionId);
  }

  if (step === 'details') {
    return journeyPath(language, JOURNEY_PAGES.POT_CONTRIBUTIONS, sessionId);
  }

  return journeyPath(language, JOURNEY_PAGES.POT_SUMMARY, sessionId);
};

export const handlePensionsAction = async ({
  action,
  step,
  body,
  language,
  sessionId,
  removeIndex,
}: {
  action: PensionsAction;
  step: PensionStep;
  body: Record<string, unknown>;
  language: string;
  sessionId: string;
  removeIndex?: number;
}): Promise<Result> => {
  let data = parsePensionsForm(body);
  let errors: PotsOfMoneyErrors = {};
  let valid = true;
  const currentPath = journeyPath(language, pageForStep(step), sessionId);
  let redirectPath = currentPath;

  if (action === 'add') {
    data = addPot(data);
    redirectPath = `${currentPath}#${potNameId(data.pots.length - 1)}`;
  }

  if (action === 'remove') {
    data = removePot(data, removeIndex ?? Number(body.index));
  }

  if (action === 'save') {
    redirectPath = journeyPath(language, JOURNEY_PAGES.SAVE, sessionId);
  }

  if (action === 'continue') {
    errors = getStepValidationErrors(step, data);
    valid = !hasPensionErrors(errors);
    redirectPath = valid
      ? getContinueRedirectPath(step, data, language, sessionId)
      : journeyPath(language, pageForStep(step), sessionId, {
          error: 'true',
        });
  }

  await savePensionsToSession(sessionId, data);
  return { data, errors, redirectPath, valid };
};
