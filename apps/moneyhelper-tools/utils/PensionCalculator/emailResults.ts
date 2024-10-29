import { DataFromQuery } from '@maps-react/utils/pageFilter';
import { ContributionCalculatorResults } from './contributionCalculator';
import { useTranslation } from '@maps-digital/shared/hooks';

export function emailResultsFormat(
  queryData: DataFromQuery,
  results: ContributionCalculatorResults,
  salary: number,
  contentResults: Record<string, string>,
  z: ReturnType<typeof useTranslation>['z'],
) {
  const emailBodyText = `
    1. ${z({
      en: 'Your details',
      cy: 'Eich manylion',
    })}: ${queryData.age} ${z({
    en: 'Years',
    cy: 'Oed',
  })}, £${queryData.salary} ${z({
    en: 'per year',
    cy: 'y flwyddyn',
  })}, ${queryData.contributionType} ${z({
    en: 'salary',
    cy: 'cyflog',
  })}\n
    2. ${z({
      en: 'Your contributions: You',
      cy: 'Eich cyfraniadau: Chi',
    })}: ${queryData.employeeContribution}%, ${z({
    en: 'Your employer',
    cy: 'Eich cyflogwr',
  })}: ${queryData.employerContribution}%\n
    3. ${z({
      en: 'Your Results',
      cy: 'Eich Canlyniadau',
    })}\n
    ${z({
      en: 'Qualifying earnings',
      cy: 'Enillion cymwys',
    })}: £${salary.toLocaleString()}\n
    
    ${contentResults.employee}: £${results.yourContribution} (${
    contentResults.taxRelief
  } ${z({
    en: 'of',
    cy: 'o',
  })} £${results.taxRelief})\n
    ${contentResults.employer}: £${results.employerContribution}\n
    ${contentResults.total}: £${results.totalContribution}
      `;

  return emailBodyText;
}
