import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { H3 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

interface BenefitsCalloutProps {
  className?: string;
  testId?: string;
}

export const BenefitsCallout = ({
  className,
  testId,
}: BenefitsCalloutProps) => {
  const { z } = useTranslation();

  return (
    <Callout
      variant={CalloutVariant.INFORMATION}
      testId={testId ?? 'salary-calculator-benefits-callout'}
      className={className ?? 'px-10 pt-6 pb-8 mt-4'}
    >
      <H3
        className="!text-[24px] !leading-[36px] mb-4 text-gray-800"
        level="h3"
      >
        {z({
          en: 'Are you missing out on extra help?',
          cy: "Ydych chi'n colli allan ar gymorth ychwanegol?",
        })}
      </H3>
      {z({
        en: (
          <Paragraph className="text-gray-800">
            You could still get benefits even if you are working. Check to see
            if you could get a vital boost to your income with our{' '}
            <Link
              href="https://www.moneyhelper.org.uk/en/benefits/benefits-calculator"
              target="_blank"
              withIcon={false}
            >
              10-minute benefits calculator
            </Link>
            .
          </Paragraph>
        ),
        cy: (
          <Paragraph className="text-gray-800">
            Gallech gael budd-daliadau hyd yn oed os ydych chi&apos;n gweithio.
            Gwiriwch i weld a allech chi gael hwb hanfodol i&apos;ch incwm
            gyda&apos;n{' '}
            <Link
              href="https://www.moneyhelper.org.uk/en/benefits/benefits-calculator"
              target="_blank"
              withIcon={false}
            >
              cyfrifiannell budd-daliadau 10-munud
            </Link>
            .
          </Paragraph>
        ),
      })}
    </Callout>
  );
};
