import { useFocusOnMount } from 'hooks/useFocusOnMount';

import { H3 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import {
  NotificationBox,
  NotificationBoxVariant,
} from '@maps-react/common/components/NotificationBox';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useLanguage from '@maps-react/hooks/useLanguage';
import useTranslation from '@maps-react/hooks/useTranslation';

interface StatePensionCalloutProps {
  className?: string;
  isEmbed?: boolean;
}

export const StatePensionCallout = ({
  className,
  isEmbed,
}: StatePensionCalloutProps) => {
  const { z } = useTranslation();
  const language = useLanguage();
  const ref = useFocusOnMount<HTMLDivElement>();
  return (
    <div
      id="state-pension-notification"
      data-testid="state-pension-notification"
      ref={ref}
      tabIndex={-1}
      className={`col-span-12 xl:col-span-10 mb-6 lg:mb-8 focus:outline-none ${className}`}
    >
      <NotificationBox variant={NotificationBoxVariant.WARNING}>
        <H3 className="font-semibold mb-4 text-gray-800">
          {z({
            en: 'Are you about to reach State Pension age?',
            cy: 'Ydych chi ar fin cyrraedd oedran  Pensiwn y Wladwriaeth?',
          })}
        </H3>

        <Paragraph className="mt-4">
          {z({
            en: 'It looks like you could be nearing the State Pension age soon. Reaching State Pension age, can mean a shift in how you manage your money. ',
            cy: "Mae'n edrych fel eich bod yn agosáu at oedran Pensiwn y Wladwriaeth. Gall cyrraedd oedran Pensiwn y Wladwriaeth olygu newid yn y ffordd rydych chi'n rheoli eich arian.",
          })}
        </Paragraph>

        <Paragraph>
          {z({
            en: 'Before you retire, you can review your budget, check your estimated pension income, plan when you stop working, and decide how - and when - you’d like to take your pension. MoneyHelper has a ',
            cy: "Cyn i chi ymddeol, gallwch adolygu eich cyllideb, gwirio'ch incwm pensiwn amcangyfrifedig, cynllunio pryd y byddwch yn rhoi'r gorau i weithio, a phenderfynu sut – a phryd – yr hoffech dderbyn eich pensiwn. Mae gan HelpwrArian ",
          })}
          <Link
            href={`https://www.moneyhelper.org.uk/${language}/pensions-and-retirement/taking-your-pension/checklist-things-to-do-as-retirement-approaches`}
            target={isEmbed ? '_blank' : '_self'}
            asInlineText
          >
            {z({
              en: 'free guidance',
              cy: 'ganllawiau am ddim',
            })}
          </Link>
          {z({
            en: ' to help you.',
            cy: " i'ch helpu.",
          })}
        </Paragraph>
        <Paragraph className="mt-4">
          {z({
            en: 'You can ',
            cy: 'Gallwch ',
          })}
          <Link
            href="https://www.gov.uk/state-pension-age"
            target="_blank"
            asInlineText
          >
            {z({
              en: 'check the official State Pension age here',
              cy: 'wirio oedran swyddogol Pensiwn y Wladwriaeth yma.',
            })}
          </Link>
          {'.'}
        </Paragraph>
      </NotificationBox>
    </div>
  );
};
