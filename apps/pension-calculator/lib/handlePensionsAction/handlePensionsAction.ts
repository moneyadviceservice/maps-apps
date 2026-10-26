import { JOURNEY_PAGES } from 'data/journey';
import {
  saveIncomePensionsToSession,
  savePensionsToSession,
} from 'lib/session/pensionsSession';
import {
  hasPensionErrors,
  validateIncomeScreening,
  validatePotDetails,
  validatePotScreening,
} from 'lib/validation/pensions';
import type {
  DefinedIncomeData,
  DefinedIncomeErrors,
  PensionsAction,
  PensionsFlow,
  PensionStep,
  PotsOfMoneyData,
  PotsOfMoneyErrors,
} from 'types/pensions';
import { addPot, removePot } from 'utils/dcPotRows';
import { journeyPath } from 'utils/journeyPath';
import {
  parseIncomePensionForm,
  parsePensionPotsForm,
} from 'utils/parsePensionsForm';
import { potNameId } from 'utils/pensionFieldIds';

const pageForStep = (step: PensionStep, flow: PensionsFlow) => {
  if (flow === 'income-pensions') {
    if (step === 'details') return JOURNEY_PAGES.INCOME_DETAILS;
    return JOURNEY_PAGES.INCOME_PENSIONS;
  }

  if (step === 'details') return JOURNEY_PAGES.POT_DETAILS;
  if (step === 'contributions') return JOURNEY_PAGES.POT_CONTRIBUTIONS;
  return JOURNEY_PAGES.POTS_OF_MONEY;
};

const getStepValidationErrors = (
  step: PensionStep,
  data: PotsOfMoneyData | DefinedIncomeData,
  flow: PensionsFlow,
): PotsOfMoneyErrors | DefinedIncomeErrors => {
  if (flow === 'pots-of-money') {
    const potsData = data as PotsOfMoneyData;
    if (step === 'screening') return validatePotScreening(potsData);
    if (step === 'details') return validatePotDetails(potsData);
  }

  const incomeData = data as DefinedIncomeData;
  if (step === 'screening') return validateIncomeScreening(incomeData);
  return {};
};

const incomePensionsDestination = (
  step: PensionStep,
  data: DefinedIncomeData,
  lang: string,
  sessionId: string,
) => {
  if (step === 'screening') {
    return data.hasIncomePension === 'no'
      ? journeyPath(lang, JOURNEY_PAGES.STATE_PENSION, sessionId)
      : journeyPath(lang, JOURNEY_PAGES.INCOME_DETAILS, sessionId);
  }
  return journeyPath(lang, JOURNEY_PAGES.INCOME_SUMMARY, sessionId);
};

const getContinueRedirectPath = (
  step: PensionStep,
  flow: PensionsFlow,
  data: PotsOfMoneyData | DefinedIncomeData,
  language: string,
  sessionId: string,
) => {
  if (flow === 'income-pensions') {
    return incomePensionsDestination(
      step,
      data as DefinedIncomeData,
      language,
      sessionId,
    );
  }

  const potsData = data as PotsOfMoneyData;
  if (step === 'screening') {
    return potsData.hasPotOfMoneyPension === 'no'
      ? journeyPath(language, JOURNEY_PAGES.INCOME_PENSIONS, sessionId)
      : journeyPath(language, JOURNEY_PAGES.POT_DETAILS, sessionId);
  }

  return journeyPath(language, JOURNEY_PAGES.POT_SUMMARY, sessionId);
};

export type Result = {
  data: PotsOfMoneyData | DefinedIncomeData;
  errors: PotsOfMoneyErrors | DefinedIncomeErrors;
  redirectPath: string;
  valid: boolean;
};

export const handlePensionsAction = async ({
  action,
  step,
  flow = 'pots-of-money',
  body,
  language,
  sessionId,
  removeIndex,
}: {
  action: PensionsAction;
  step: PensionStep;
  flow?: PensionsFlow;
  body: Record<string, unknown>;
  language: string;
  sessionId: string;
  removeIndex?: number;
}): Promise<Result> => {
  let data: PotsOfMoneyData | DefinedIncomeData;
  if (flow === 'pots-of-money') {
    data = parsePensionPotsForm(body);
  } else {
    data = parseIncomePensionForm(body);
  }

  let errors: PotsOfMoneyErrors | DefinedIncomeErrors = {};
  let valid = true;
  const currentPath = journeyPath(language, pageForStep(step, flow), sessionId);
  let redirectPath = currentPath;

  if (action === 'add' && flow === 'pots-of-money') {
    data = addPot(data as PotsOfMoneyData);
    redirectPath = `${currentPath}#${potNameId(
      (data as PotsOfMoneyData).pots.length - 1,
    )}`;
  }

  if (action === 'remove' && flow === 'pots-of-money') {
    data = removePot(
      data as PotsOfMoneyData,
      removeIndex ?? Number(body.index),
    );
  }

  if (action === 'save') {
    redirectPath = journeyPath(language, JOURNEY_PAGES.SAVE, sessionId);
  }

  if (action === 'continue') {
    errors = getStepValidationErrors(step, data, flow);
    valid = !hasPensionErrors(errors);
    redirectPath = valid
      ? getContinueRedirectPath(step, flow, data, language, sessionId)
      : journeyPath(language, pageForStep(step, flow), sessionId, {
          error: 'true',
        });
  }

  if (flow === 'pots-of-money') {
    await savePensionsToSession(sessionId, data as PotsOfMoneyData);
  } else {
    await saveIncomePensionsToSession(sessionId, data as DefinedIncomeData);
  }

  return { data, errors, redirectPath, valid };
};
