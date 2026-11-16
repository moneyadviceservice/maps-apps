import { getPensionErrorMessage } from 'data/pensions';
import type {
  DefinedIncomeData,
  DefinedIncomeErrors,
  PotsOfMoneyData,
  PotsOfMoneyErrors,
} from 'types/pensions';
import {
  annualManagementChargeId,
  contributionFieldId,
  INCOME_SCREENING_ID,
  POT_SCREENING_ID,
  potCurrentValueId,
  potTaxFreeCashId,
} from 'utils/pensionFieldIds';

type PensionErrors = PotsOfMoneyErrors | DefinedIncomeErrors;

const amount = (value: string) =>
  /^\d+(\.\d{1,2})?$/.test(value.replaceAll(',', '').trim());

const addError = (errors: PensionErrors, id: string, message: string) => {
  (errors as Record<string, string[]>)[id] = [message];
};

export const validatePotScreening = (
  data: PotsOfMoneyData,
): PotsOfMoneyErrors => {
  const errors: PotsOfMoneyErrors = {};
  if (!data.hasPotOfMoneyPension) {
    addError(
      errors,
      POT_SCREENING_ID,
      getPensionErrorMessage('screeningRequired'),
    );
  }
  return errors;
};

export const validateIncomeScreening = (
  data: DefinedIncomeData,
): DefinedIncomeErrors => {
  const errors: DefinedIncomeErrors = {};
  if (!data.hasIncomePension) {
    addError(
      errors,
      INCOME_SCREENING_ID,
      getPensionErrorMessage('screeningRequired'),
    );
  }
  return errors;
};

export const validatePotDetails = (
  data: PotsOfMoneyData,
): PotsOfMoneyErrors => {
  const errors: PotsOfMoneyErrors = {};

  data.pots.forEach((pot, index) => {
    // 1. Current Value Validation
    const currentValueId = potCurrentValueId(index);
    if (!pot.currentValue.trim()) {
      addError(
        errors,
        currentValueId,
        getPensionErrorMessage('currentValueRequired'),
      );
    } else if (!amount(pot.currentValue)) {
      addError(errors, currentValueId, getPensionErrorMessage('amountInvalid'));
    }

    // 2. Tax-Free Cash Validation
    if (pot.taxFreeCash?.trim() && !amount(pot.taxFreeCash)) {
      addError(
        errors,
        potTaxFreeCashId(index),
        getPensionErrorMessage('amountInvalid'),
      );
    }

    // 3. Employee & Employer Contributions Validation
    (['employee', 'employer'] as const).forEach((kind) => {
      const contribution = pot[`${kind}Contribution` as const];
      if (!contribution) return;

      const valueId = contributionFieldId(kind, 'value', index);

      if (contribution.mode === 'percentage' && contribution.value?.trim()) {
        const value = Number(contribution.value.replaceAll(',', ''));
        if (!Number.isFinite(value) || value < 0 || value > 100) {
          addError(
            errors,
            valueId,
            getPensionErrorMessage('percentageInvalid'),
          );
        }
      } else if (
        contribution.mode === 'fixed' &&
        contribution.value?.trim() &&
        !amount(contribution.value)
      ) {
        addError(errors, valueId, getPensionErrorMessage('amountInvalid'));
      }
    });

    // 4. Annual Management Charge Validation
    if (
      pot.annualManagementCharge?.trim() &&
      !amount(pot.annualManagementCharge)
    ) {
      addError(
        errors,
        annualManagementChargeId(index),
        getPensionErrorMessage('amountInvalid'),
      );
    }
  });

  return errors;
};

export const hasPensionErrors = (errors: PensionErrors) =>
  Object.keys(errors).length > 0;
