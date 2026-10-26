import { useFocusOnMount } from 'hooks/useFocusOnMount';

import { H3 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import {
  NotificationBox,
  NotificationBoxVariant,
} from '@maps-react/common/components/NotificationBox';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useLanguage } from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';

interface HighEarningsCalloutProps {
  grossIncome: string;
  taxCode: string;
  isEmbed?: boolean;
  className?: string;
}

export const HighEarningsCallout = ({
  grossIncome,
  taxCode,
  isEmbed,
  className = '',
}: HighEarningsCalloutProps) => {
  const { z } = useTranslation();
  const language = useLanguage();
  const ref = useFocusOnMount<HTMLDivElement>();

  if (!(Number(grossIncome) >= 100000 && taxCode === '1257L')) {
    return null;
  }

  return (
    <div
      id="high-earnings-notification"
      data-testid="high-earnings-notification"
      ref={ref}
      tabIndex={-1}
      className={`col-span-12 xl:col-span-10 mb-6 lg:mb-8 focus:outline-none ${className}`}
    >
      <NotificationBox variant={NotificationBoxVariant.WARNING}>
        <H3 className="font-semibold mb-4 text-gray-800">
          {z({
            en: 'Higher earnings can impact your tax-free allowance',
            cy: 'Gall enillion uwch effeithio ar eich lwfans di-dreth',
          })}
        </H3>

        <Paragraph className="mt-4">
          {z({
            en: 'Your salary could mean that your personal allowance - the amount you can earn that is tax free - is reduced.',
            cy: 'Gallai eich cyflog olygu bod eich lwfans personol – y swm y gallwch ei ennill heb dalu treth arno – yn cael ei leihau.',
          })}
        </Paragraph>

        <Paragraph>
          {z({
            en: 'For every £2 you earn over £100,000 after your pension contributions are taken out, your personal allowance is reduced by £1. See ',
            cy: 'Am bob £2 rydych yn ei ennill dros £100,000 ar ôl tynnu cyfraniadau pensiwn, mae eich lwfans personol yn cael ei leihau gan £1. Gweler ',
          })}
          <Link
            href={`https://www.moneyhelper.org.uk/${language}/work/employment/how-income-tax-and-personal-allowance-works`}
            target={isEmbed ? '_blank' : '_self'}
            asInlineText
          >
            {z({
              en: 'more about how the personal allowance works',
              cy: "mwy am sut mae'r lwfans personol yn gweithio",
            })}
          </Link>
          {'.'}
        </Paragraph>
      </NotificationBox>
    </div>
  );
};
