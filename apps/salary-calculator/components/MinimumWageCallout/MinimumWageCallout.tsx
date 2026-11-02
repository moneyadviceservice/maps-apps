import type { SalaryFormData } from 'components/SalaryForm';
import { useFocusOnMount } from 'hooks/useFocusOnMount';
import { MINIMUM_HOURLY_WAGE } from 'utils/rates/constants';

import { H3 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import {
  NotificationBox,
  NotificationBoxVariant,
} from '@maps-react/common/components/NotificationBox';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type Salary = Pick<SalaryFormData, 'grossIncome' | 'grossIncomeFrequency'>;

interface MinimumWageCalloutProps {
  salary: Salary;
  className: string;
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
}: MinimumWageCalloutProps) => {
  const { z, locale } = useTranslation();
  const ref = useFocusOnMount<HTMLDivElement>();

  if (!isBelowMinimumWage(salary)) return null;

  const minimumWageRatesUrl =
    locale === 'cy'
      ? 'https://www.gov.uk/cyfraddau-isafswm-cyflog-cenedlaethol'
      : 'https://www.gov.uk/national-minimum-wage-rates';

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={`col-span-12 xl:col-span-10 mb-6 lg:mb-8 focus:outline-none ${className}`}
    >
      <NotificationBox variant={NotificationBoxVariant.WARNING}>
        <H3 className="font-semibold mb-4 text-gray-800">
          {z({
            en: 'Your hourly rate may be below minimum wage',
            cy: 'Efallai bod eich cyfradd fesul awr yn is na’r isafswm cyflog',
          })}
        </H3>

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
      </NotificationBox>
    </div>
  );
};
