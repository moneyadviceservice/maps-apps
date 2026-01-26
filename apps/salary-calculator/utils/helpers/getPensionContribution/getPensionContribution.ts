import { PensionContributionType } from '../../calculations/getSalaryBreakdown/getSalaryBreakdown';

type PensionContributionResult = {
  pensionType: PensionContributionType;
  pensionValue: number | null;
};

export function getPensionContribution(
  query: Record<string, unknown>,
): PensionContributionResult {
  const parseNumeric = (val: unknown): number | null => {
    if (typeof val !== 'string' || val.trim() === '') return null;
    const clean = val.replaceAll(',', '');
    const num = Number(clean);
    return Number.isFinite(num) ? num : null;
  };

  const pensionPercent = parseNumeric(query['pensionPercent']);
  const pensionFixed = parseNumeric(query['pensionFixed']);

  if (pensionPercent !== null && pensionPercent > 0) {
    return { pensionType: 'percentage', pensionValue: pensionPercent };
  }

  if (pensionFixed !== null && pensionFixed > 0) {
    return { pensionType: 'fixed', pensionValue: pensionFixed };
  }

  return { pensionType: 'fixed', pensionValue: null };
}
