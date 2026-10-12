import { getPensionErrorMessage } from 'data/pensions';
import type { PotsOfMoneyData, PotsOfMoneyErrors } from 'types/pensions';
import {
  contributionFieldId,
  POT_SCREENING_ID,
  potCurrentValueId,
} from 'utils/pensionFieldIds';

const amount = (value: string) =>
  /^\d+(\.\d{1,2})?$/.test(value.replaceAll(',', '').trim());
const add = (errors: PotsOfMoneyErrors, id: string, message: string) => {
  errors[id] = [message];
};

export const validatePotScreening = (
  data: PotsOfMoneyData,
): PotsOfMoneyErrors => {
  const errors: PotsOfMoneyErrors = {};
  if (!data.hasPotOfMoneyPension)
    add(errors, POT_SCREENING_ID, getPensionErrorMessage('screeningRequired'));
  return errors;
};

export const validatePotDetails = (
  data: PotsOfMoneyData,
): PotsOfMoneyErrors => {
  const errors: PotsOfMoneyErrors = {};
  data.pots.forEach((pot, index) => {
    const id = potCurrentValueId(index);
    if (!pot.currentValue.trim())
      add(errors, id, getPensionErrorMessage('currentValueRequired'));
    else if (!amount(pot.currentValue))
      add(errors, id, getPensionErrorMessage('amountInvalid'));
    if (pot.taxFreeCash.trim() && !amount(pot.taxFreeCash))
      add(
        errors,
        `pension-pot-${index}-taxFreeCash`,
        getPensionErrorMessage('amountInvalid'),
      );
  });
  return errors;
};

export const validateContributions = (
  data: PotsOfMoneyData,
): PotsOfMoneyErrors => {
  const errors: PotsOfMoneyErrors = {};
  (['employee', 'employer'] as const).forEach((kind) => {
    const contribution = data[`${kind}Contribution`];
    if (contribution.mode === 'percentage' && contribution.value.trim()) {
      const value = Number(contribution.value.replaceAll(',', ''));
      if (!Number.isFinite(value) || value < 0 || value > 100)
        add(
          errors,
          contributionFieldId(kind, 'value'),
          getPensionErrorMessage('percentageInvalid'),
        );
    } else if (
      contribution.mode === 'fixed' &&
      contribution.value.trim() &&
      !amount(contribution.value)
    ) {
      add(
        errors,
        contributionFieldId(kind, 'value'),
        getPensionErrorMessage('amountInvalid'),
      );
    }
  });
  return errors;
};

export const hasPensionErrors = (errors: PotsOfMoneyErrors) =>
  Object.keys(errors).length > 0;
