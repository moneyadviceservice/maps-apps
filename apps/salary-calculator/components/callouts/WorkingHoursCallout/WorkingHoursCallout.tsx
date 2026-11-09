import type { SalaryFormData } from 'components/SalaryForm';
import { MAXIMUM_WEEKLY_HOURS } from 'utils/rates/constants';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { ResultsCallout } from '../ResultsCallout';
import { ResultsCalloutWrapper } from '../ResultsCalloutWrapper';

type Salary = Pick<SalaryFormData, 'grossIncomeFrequency' | 'hoursPerWeek'>;

interface WorkingHoursCalloutProps {
  salary: Salary;
  className: string;
  showSkipToContent?: boolean;
}

export const isOverWorkingHoursLimit = ({
  grossIncomeFrequency,
  hoursPerWeek,
}: Salary) =>
  grossIncomeFrequency === 'hourly' &&
  Number(hoursPerWeek) > MAXIMUM_WEEKLY_HOURS;

export const WorkingHoursCallout = ({
  salary,
  className,
  showSkipToContent,
}: WorkingHoursCalloutProps) => {
  const { z } = useTranslation();

  if (!isOverWorkingHoursLimit(salary)) return null;

  return (
    <ResultsCalloutWrapper
      id="working-hours-notification"
      className={className}
    >
      <ResultsCallout
        showSkipToContent={showSkipToContent}
        title={z({
          en: 'You may be working more hours than the limit',
          cy: "Efallai eich bod yn gweithio mwy o oriau na'r terfyn",
        })}
      >
        <Paragraph className="text-gray-800">
          {z({
            en: "48 hours on average across four months is usually the most you can legally work in a week. However, you can voluntarily opt out. If you haven't chosen to do this, talk to your employer about reviewing your hours.",
            cy: "Ar gyfartaledd, 48 awr yr wythnos dros gyfnod o bedwar mis yw'r uchafswm y gallwch ei weithio'n gyfreithlon fel arfer. Fodd bynnag, gallwch ddewis peidio â dilyn y rheol hon yn wirfoddol. Os nad ydych wedi gwneud hynny, siaradwch â'ch cyflogwr am adolygu eich oriau gwaith.",
          })}
        </Paragraph>

        <Paragraph>
          {z({
            en: 'Need some help? Get free, confidential advice from ',
            cy: 'Angen help? Cewch gyngor cyfrinachol am ddim gan ',
          })}
          <Link href="https://www.acas.org.uk/" asInlineText target="_blank">
            Acas
          </Link>
          {z({ en: ', or ', cy: ", neu'r llinell gymorth " })}
          <Link href="https://www.lra.org.uk/" asInlineText target="_blank">
            Labour Relations
          </Link>
          {z({
            en: " helpline if you're in Northern Ireland.",
            cy: ' os ydych yng Ngogledd Iwerddon.',
          })}
        </Paragraph>
      </ResultsCallout>
    </ResultsCalloutWrapper>
  );
};
