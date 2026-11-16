import { PensionContributionType } from '../../calculations/getSalaryBreakdown/getSalaryBreakdown';

type PensionContributionResult = {
  pensionType: PensionContributionType;
  pensionValue: number | null;
};

export type PensionContributor = 'employee' | 'employer';

const pensionQueryKeys: Record<
  PensionContributor,
  { type: string; value: string }
> = {
  employee: { type: 'pensionType', value: 'pensionValue' },
  employer: { type: 'employerPensionType', value: 'employerPensionValue' },
};

const parseNumeric = (val: unknown): number | null => {
  if (typeof val !== 'string' || val.trim() === '') return null;
  const clean = val.replaceAll(',', '');
  const num = Number(clean);
  return Number.isFinite(num) ? num : null;
};

export function getPensionContribution(
  query: Record<string, unknown>,
  contributor: PensionContributor = 'employee',
): PensionContributionResult {
  const keys = pensionQueryKeys[contributor];

  const pensionType: PensionContributionType =
    query[keys.type] === 'fixed' ? 'fixed' : 'percentage';
  const pensionValue = parseNumeric(query[keys.value]);

  if (pensionValue !== null && pensionValue > 0) {
    return { pensionType, pensionValue };
  }

  // Links shared before the type dropdown existed carry pensionPercent / pensionFixed
  const hasCurrentKeys = keys.type in query || keys.value in query;

  if (contributor === 'employee' && !hasCurrentKeys) {
    const pensionPercent = parseNumeric(query['pensionPercent']);
    const pensionFixed = parseNumeric(query['pensionFixed']);

    if (pensionPercent !== null && pensionPercent > 0) {
      return { pensionType: 'percentage', pensionValue: pensionPercent };
    }

    if (pensionFixed !== null && pensionFixed > 0) {
      return { pensionType: 'fixed', pensionValue: pensionFixed };
    }
  }

  return { pensionType, pensionValue: null };
}
