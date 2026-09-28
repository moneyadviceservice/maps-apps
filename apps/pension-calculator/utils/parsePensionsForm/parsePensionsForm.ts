import { parseFrequency } from 'data/frequency';
import {
  type ContributionMode,
  defaultPotsOfMoneyData,
  emptyPot,
  type PotsOfMoneyData,
  type YesNo,
} from 'types/pensions';
import { asString } from 'utils/formValue';
import {
  contributionFieldId,
  POT_COUNT_NAME,
  POT_SCREENING_NAME,
  potCurrentValueId,
  potNameId,
  potTaxFreeCashId,
} from 'utils/pensionFieldIds';

const yesNo = (value: string): YesNo =>
  value === 'yes' || value === 'no' ? value : '';
const mode = (value: string): ContributionMode =>
  value === 'fixed' ? 'fixed' : 'percentage';

const nested = (value: unknown) =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

export const parsePensionsForm = (
  body: Record<string, unknown>,
): PotsOfMoneyData => {
  const structuredPots = Array.isArray(body.pots)
    ? body.pots.map((pot) => {
        const item = nested(pot);
        return {
          name: asString(item.name),
          currentValue: asString(item.currentValue),
          taxFreeCash: asString(item.taxFreeCash),
        };
      })
    : null;
  const count = Math.max(1, Number(asString(body[POT_COUNT_NAME])) || 1);
  const formPots = Array.from({ length: count }, (_, index) => ({
    name: asString(body[potNameId(index)]),
    currentValue: asString(body[potCurrentValueId(index)]),
    taxFreeCash: asString(body[potTaxFreeCashId(index)]),
  }));

  const employee = nested(body.employeeContribution);
  const employer = nested(body.employerContribution);
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
    employeeContribution: {
      mode: mode(
        asString(
          body[contributionFieldId('employee', 'mode')] ?? employee.mode,
        ),
      ),
      value: asString(
        body[contributionFieldId('employee', 'value')] ?? employee.value,
      ),
      frequency: parseFrequency(
        asString(
          body[contributionFieldId('employee', 'frequency')] ??
            employee.frequency,
        ),
      ),
    },
    employerContribution: {
      mode: mode(
        asString(
          body[contributionFieldId('employer', 'mode')] ?? employer.mode,
        ),
      ),
      value: asString(
        body[contributionFieldId('employer', 'value')] ?? employer.value,
      ),
      frequency: parseFrequency(
        asString(
          body[contributionFieldId('employer', 'frequency')] ??
            employer.frequency,
        ),
      ),
    },
    annualManagementCharge: asString(body.annualManagementCharge),
  };
};

export const ensurePensionsDefaults = (
  data?: Partial<PotsOfMoneyData> | null,
): PotsOfMoneyData => {
  if (!data) return defaultPotsOfMoneyData();
  return {
    ...defaultPotsOfMoneyData(),
    ...data,
    hasPotOfMoneyPension: yesNo(data.hasPotOfMoneyPension ?? ''),
    pots: data.pots?.length
      ? data.pots.map((pot) => ({ ...emptyPot(), ...pot }))
      : [emptyPot()],
    employeeContribution: {
      ...defaultPotsOfMoneyData().employeeContribution,
      ...data.employeeContribution,
    },
    employerContribution: {
      ...defaultPotsOfMoneyData().employerContribution,
      ...data.employerContribution,
    },
  };
};
