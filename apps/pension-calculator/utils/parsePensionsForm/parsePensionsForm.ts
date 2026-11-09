import { parseFrequency } from 'data/frequency';
import type {
  ContributionMode,
  DefinedIncomeData,
  PotsOfMoneyData,
  YesNo,
} from 'types/pensions';
import {
  defaultDefinedIncomeData,
  defaultPotsOfMoneyData,
  emptyIncomePot,
  emptyPot,
} from 'types/pensions';
import { asString } from 'utils/formValue';
import {
  contributionFieldId,
  estimatedYearlyValueId,
  INCOME_SCREENING_NAME,
  incomePotFieldId,
  POT_COUNT_NAME,
  POT_SCREENING_NAME,
  potAgeItStartsPayingId,
  potCurrentValueId,
  potNameId,
  potTaxFreeCashId,
} from 'utils/pensionFieldIds';

const yesNo = (value: string): YesNo =>
  value === 'yes' || value === 'no' ? value : '';

const mode = (value: string): ContributionMode =>
  value === 'fixed' ? 'fixed' : 'percentage';

const nested = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === 'object') {
    return value as Record<string, unknown>;
  }
  return {};
};

export const parsePensionPotsForm = (
  body: Record<string, unknown>,
): PotsOfMoneyData => {
  const structuredPots = Array.isArray(body.pots)
    ? body.pots.map((pot) => {
        const item = nested(pot);
        const employeeContrib = nested(item.employeeContribution);
        const employerContrib = nested(item.employerContribution);

        return {
          name: asString(item.name),
          currentValue: asString(item.currentValue),
          taxFreeCash: asString(item.taxFreeCash),
          employeeContribution: {
            mode: mode(asString(employeeContrib.mode)),
            value: asString(employeeContrib.value),
            frequency: parseFrequency(asString(employeeContrib.frequency)),
          },
          employerContribution: {
            mode: mode(asString(employerContrib.mode)),
            value: asString(employerContrib.value),
            frequency: parseFrequency(asString(employerContrib.frequency)),
          },
          annualManagementCharge: asString(item.annualManagementCharge),
        };
      })
    : null;

  const count = Math.max(1, Number(asString(body[POT_COUNT_NAME])) || 1);
  const formPots = Array.from({ length: count }, (_, index) => ({
    name: asString(body[potNameId(index)]),
    currentValue: asString(body[potCurrentValueId(index)]),
    taxFreeCash: asString(body[potTaxFreeCashId(index)]),
    employeeContribution: {
      mode: mode(
        asString(body[contributionFieldId('employee', 'mode', index)]),
      ),
      value: asString(body[contributionFieldId('employee', 'value', index)]),
      frequency: parseFrequency(
        asString(body[contributionFieldId('employee', 'frequency', index)]),
      ),
    },
    employerContribution: {
      mode: mode(
        asString(body[contributionFieldId('employer', 'mode', index)]),
      ),
      value: asString(body[contributionFieldId('employer', 'value', index)]),
      frequency: parseFrequency(
        asString(body[contributionFieldId('employer', 'frequency', index)]),
      ),
    },
    annualManagementCharge: asString(body.annualManagementCharge),
  }));

  let pots: PotsOfMoneyData['pots'];
  if (structuredPots?.length) {
    pots = structuredPots;
  } else if (formPots.length) {
    pots = formPots;
  } else {
    pots = [emptyPot()];
  }

  return {
    hasPotOfMoneyPension: yesNo(
      asString(body[POT_SCREENING_NAME] ?? body.hasPotOfMoneyPension),
    ),
    pots,
  };
};

export const parseIncomePensionForm = (
  body: Record<string, unknown>,
): DefinedIncomeData => {
  const structuredIncomePots = Array.isArray(body.pots)
    ? body.pots.map((pot) => {
        const item = nested(pot);
        return {
          name: asString(item.name),
          estimatedYearlyValue: asString(item.currentValue),
          ageItStartsPaying: asString(item.ageItStartsPaying),
          taxFreeCash: asString(item.taxFreeCash),
        };
      })
    : null;

  const count = Math.max(1, Number(asString(body[POT_COUNT_NAME])) || 1);
  const formPots = Array.from({ length: count }, (_, index) => ({
    name: asString(body[incomePotFieldId(index, 'name')]),
    estimatedYearlyValue: asString(body[estimatedYearlyValueId(index)]),
    ageItStartsPaying: asString(body[potAgeItStartsPayingId(index)]),
    taxFreeCash: asString(body[potTaxFreeCashId(index)]),
  }));

  let incomePots: DefinedIncomeData['pots'];
  if (structuredIncomePots?.length) {
    incomePots = structuredIncomePots;
  } else if (formPots.length) {
    incomePots = formPots;
  } else {
    incomePots = [emptyIncomePot()];
  }

  return {
    hasIncomePension: yesNo(
      asString(body[INCOME_SCREENING_NAME] ?? body.hasIncomePension),
    ),
    pots: incomePots,
    annualManagementCharge: asString(body.annualManagementCharge),
  };
};

export const ensurePensionsDefaults = (
  data?: Partial<PotsOfMoneyData> | null,
): PotsOfMoneyData => {
  if (!data) {
    return defaultPotsOfMoneyData();
  }

  return {
    ...defaultPotsOfMoneyData(),
    ...data,
    hasPotOfMoneyPension: yesNo(data.hasPotOfMoneyPension ?? ''),
    pots: data.pots?.length
      ? data.pots.map((pot) => ({ ...emptyPot(), ...pot }))
      : [emptyPot()],
  };
};

export const ensureIncomePensionsDefaults = (
  data?: Partial<DefinedIncomeData> | null,
): DefinedIncomeData => {
  const defaults = defaultDefinedIncomeData();
  if (!data) {
    return defaults;
  }

  return {
    ...defaults,
    ...data,
    hasIncomePension: yesNo(data.hasIncomePension ?? ''),
    pots: data.pots?.length
      ? data.pots.map((pot) => ({ ...defaults.pots[0], ...pot }))
      : defaults.pots,
  };
};
