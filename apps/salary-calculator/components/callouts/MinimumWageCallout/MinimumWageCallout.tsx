import type { SalaryFormData } from 'components/SalaryForm';
import { MINIMUM_HOURLY_WAGE } from 'utils/rates/constants';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { ResultsCallout } from '../ResultsCallout';
import { ResultsCalloutWrapper } from '../ResultsCalloutWrapper';

type Salary = Pick<SalaryFormData, 'grossIncome' | 'grossIncomeFrequency'>;

interface MinimumWageCalloutProps {
  salary: Salary;
  className: string;
  showSkipToContent?: boolean;
}

export const isBelowMinimumWage = ({
  grossIncome,
  grossIncomeFrequency,
}: Salary) =>
  grossIncomeFrequency === 'hourly' &&
  Number(grossIncome) < MINIMUM_HOURLY_WAGE;

export const MinimumWageCallout = ({
  salary,
  className,
  showSkipToContent,
}: MinimumWageCalloutProps) => {
  const { z, locale } = useTranslation();

  if (!isBelowMinimumWage(salary)) return null;

  const minimumWageRatesUrl =
    locale === 'cy'
      ? 'https://www.gov.uk/cyfraddau-isafswm-cyflog-cenedlaethol'
      : 'https://www.gov.uk/national-minimum-wage-rates';

  return (
    <ResultsCalloutWrapper id="minimum-wage-notification" className={className}>
      <ResultsCallout
        title={z({
          en: 'Your hourly rate may be below minimum wage',
          cy: 'Efallai bod eich cyfradd fesul awr yn is na’r isafswm cyflog',
        })}
        showSkipToContent={showSkipToContent}
      >
        <Paragraph className="text-gray-800">
          {z({ en: "If you're ", cy: "Os ydych chi'n " })}
          <strong>21</strong>
          {z({
            en: ' or over, by law you should be earning at least ',
            cy: " oed neu'n hŷn, yn ôl y gyfraith dylech chi fod yn ennill o leiaf ",
          })}
          <strong>£{MINIMUM_HOURLY_WAGE}</strong>
          {z({ en: ' an hour.', cy: ' yr awr.' })}
        </Paragraph>

        <Paragraph>
          {z({
            en: 'Check your payslip and if you think you are earning under the legal amount, speak to your employer. See the ',
            cy: "Gwiriwch eich slip cyflog ac os ydych chi'n meddwl eich bod chi'n ennill o dan y swm cyfreithiol, siaradwch â'ch cyflogwr. Gweler y ",
          })}
          <Link href={minimumWageRatesUrl} asInlineText target="_blank">
            {z({
              en: 'National Minimum Wage rates',
              cy: 'cyfraddau Isafswm Cyflog Cenedlaethol',
            })}
          </Link>{' '}
          {z({ en: 'on Gov.uk.', cy: 'ar Gov.uk.' })}
        </Paragraph>
      </ResultsCallout>
    </ResultsCalloutWrapper>
  );
};
