import { useFocusOnMount } from 'hooks/useFocusOnMount';
import { getHmrcRates, isScottishTaxRates } from 'utils/rates/getHmrcRates';
import type { TaxYear } from 'utils/rates/types';

import { H3 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import {
  NotificationBox,
  NotificationBoxVariant,
} from '@maps-react/common/components/NotificationBox';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useLanguage from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';

interface TaxReliefCalloutProps {
  grossIncome?: number;
  employeePensionValue: number;
  employerPensionValue: number;
  isScottishTaxPayer: boolean;
  taxYear: TaxYear;
  className?: string;
}

export const isTaxReliefApplicable = ({
  grossIncome,
  employeePensionValue,
  employerPensionValue,
  isScottishTaxPayer,
  taxYear,
}: TaxReliefCalloutProps) => {
  const rates = getHmrcRates({
    taxYear,
    country: isScottishTaxPayer ? 'Scotland' : 'England/NI/Wales',
  });
  const income = Number(grossIncome);
  const meetsIncomeThreshold = isScottishTaxRates(rates)
    ? income >= rates.INTERMEDIATE_BRACKET
    : income > rates.HIGHER_BRACKET;

  return (
    meetsIncomeThreshold &&
    (employeePensionValue > 0 || employerPensionValue > 0)
  );
};

export const TaxReliefCallout = ({
  grossIncome,
  employeePensionValue,
  employerPensionValue,
  isScottishTaxPayer,
  taxYear,
  className = '',
}: TaxReliefCalloutProps) => {
  const { z } = useTranslation();
  const language = useLanguage();
  const ref = useFocusOnMount<HTMLDivElement>();

  if (
    !isTaxReliefApplicable({
      grossIncome,
      employeePensionValue,
      employerPensionValue,
      isScottishTaxPayer,
      taxYear,
    })
  ) {
    return null;
  }

  return (
    <div
      id="tax-relief-notification"
      data-testid="tax-relief-notification"
      ref={ref}
      tabIndex={-1}
      className={`col-span-12 xl:col-span-10 mb-6 lg:mb-8 focus:outline-none ${className}`}
    >
      <NotificationBox variant={NotificationBoxVariant.WARNING}>
        <H3 className="font-semibold mb-4 text-gray-800">
          {z({
            en: 'You might be eligible for extra tax relief',
            cy: 'Efallai y byddwch yn gymwys ar gyfer rhyddhad treth ychwanegol',
          })}
        </H3>

        <Paragraph className="mt-4">
          {z({
            en: 'If you are a higher rate tax payer, you might be able to claim back extra tax relief on your pension contributions, meaning you could pay slightly lower tax.',
            cy: 'Os ydych yn drethdalwr cyfradd uwch, efallai y gallwch hawlio rhyddhad treth ychwanegol yn ôl ar eich cyfraniadau pensiwn; sy’n golygu y gallech dalu ychydig yn llai o dreth.',
          })}
        </Paragraph>

        <Paragraph className="mt-4">
          {z({
            en: 'You must be both a higher rate tax payer and making pension contributions using “relief at source”. Find more information and how to claim at ',
            cy: 'Rhaid i chi fod yn drethdalwr cyfradd uwch, a hefyd fod yn gwneud cyfraniadau pensiwn gan ddefnyddio “rhyddhad wrth y ffynhonnell”. Gallwch ddod o hyd i ragor o wybodaeth, a sut i wneud cais, ar ',
          })}
          <Link
            href={`https://www.gov.uk/guidance/claim-tax-relief-on-your-private-pension-payments${
              language === 'cy' ? '.cy' : ''
            }`}
            target="_blank"
            asInlineText
          >
            {z({
              en: 'Gov.uk',
              cy: 'Gov.uk',
            })}
          </Link>
          {'.'}
        </Paragraph>
      </NotificationBox>
    </div>
  );
};
