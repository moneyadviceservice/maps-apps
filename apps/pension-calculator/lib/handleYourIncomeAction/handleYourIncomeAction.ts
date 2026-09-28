import { JOURNEY_PAGES, type JourneyAction } from 'data/journey';
import { saveIncomeToSession } from 'lib/session/incomeSession';
import {
  hasYourIncomeErrors,
  validateYourIncome,
} from 'lib/validation/yourIncome';
import type { YourIncomeData, YourIncomeErrors } from 'types/income';
import { asIndex } from 'utils/formValue';
import { OTHER_INCOME_LIST_ID, otherIncomeNameId } from 'utils/incomeFieldIds';
import { journeyPath } from 'utils/journeyPath';
import { addOtherIncomeRow, removeOtherIncomeRow } from 'utils/otherIncomeRows';
import { parseYourIncomeForm } from 'utils/parseYourIncomeForm';

export type YourIncomeAction = JourneyAction | 'add' | 'remove' | 'update';

type HandleYourIncomeResult = {
  data: YourIncomeData;
  errors: YourIncomeErrors;
  redirectPath: string;
  valid: boolean;
};

export const handleYourIncomeAction = async ({
  action,
  body,
  language,
  sessionId,
  removeIndex,
}: {
  action: YourIncomeAction;
  body: Record<string, unknown>;
  language: string;
  sessionId: string;
  removeIndex?: number;
}): Promise<HandleYourIncomeResult> => {
  let data = parseYourIncomeForm(body);
  let errors: YourIncomeErrors = {};
  let valid = true;
  const incomePath = journeyPath(
    language,
    JOURNEY_PAGES.YOUR_INCOME,
    sessionId,
  );
  let redirectPath = incomePath;

  switch (action) {
    case 'add': {
      data = addOtherIncomeRow(data);
      redirectPath = `${incomePath}#${otherIncomeNameId(
        data.otherIncome.length - 1,
      )}`;
      break;
    }
    case 'remove': {
      const rawIndex = removeIndex ?? asIndex(body.index);
      data = removeOtherIncomeRow(
        data,
        Number.isFinite(rawIndex) ? rawIndex : -1,
      );
      redirectPath = `${incomePath}#${OTHER_INCOME_LIST_ID}`;
      break;
    }
    case 'update': {
      break;
    }
    case 'save': {
      redirectPath = journeyPath(language, JOURNEY_PAGES.SAVE, sessionId);
      break;
    }
    case 'continue': {
      errors = validateYourIncome(data, language);
      valid = !hasYourIncomeErrors(errors);
      redirectPath = valid
        ? journeyPath(language, JOURNEY_PAGES.POTS_OF_MONEY, sessionId)
        : journeyPath(language, JOURNEY_PAGES.YOUR_INCOME, sessionId, {
            error: 'true',
          });
      break;
    }
  }

  await saveIncomeToSession(sessionId, data);

  return { data, errors, redirectPath, valid };
};
