import { useFocusOnMount } from 'hooks/useFocusOnMount';
import { isEmergencyTaxCode } from 'utils/helpers/isEmergencyTaxCode';

import { H3 } from '@maps-react/common/components/Heading';
import {
  NotificationBox,
  NotificationBoxVariant,
} from '@maps-react/common/components/NotificationBox';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

interface EmergencyTaxCodeCalloutProps {
  taxCode: string;
  className: string;
}

export const EmergencyTaxCodeCallout = ({
  taxCode,
  className,
}: EmergencyTaxCodeCalloutProps) => {
  const { z } = useTranslation();
  const ref = useFocusOnMount<HTMLDivElement>();

  if (!isEmergencyTaxCode(taxCode)) return null;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={`col-span-12 xl:col-span-10 mb-6 lg:mb-8 focus:outline-none ${className}`}
    >
      <NotificationBox variant={NotificationBoxVariant.WARNING}>
        <H3 className="font-semibold mb-4 text-gray-800">
          {z({
            en: 'You are likely paying more tax than you need to',
            cy: "Mae'n debyg eich bod chi'n talu mwy o dreth nag sydd angen",
          })}
        </H3>

        <Paragraph className="text-gray-800">
          {z({
            en: 'The tax code you are on is an emergency tax code. These are temporary and used mainly when you start a new job without a P45. This is normally fixed by HMRC once they receive your employment details and if you have overpaid tax you will typically receive a refund via your new payslip or a letter issued by HMRC.',
            cy: "Mae'r cod treth rydych chi arno yn god treth brys. Mae'r rhain yn rhai dros dro ac yn cael eu defnyddio'n bennaf pan fyddwch chi'n dechrau swydd newydd heb P45. Fel arfer, caiff hyn ei osod gan CThEF unwaith y byddant yn derbyn manylion eich cyflogaeth, os ydych wedi talu gormod o dreth, byddwch fel arfer yn cael ad-daliad drwy eich slip cyflog newydd neu drwy lythyr gan CThEF.",
          })}
        </Paragraph>
      </NotificationBox>
    </div>
  );
};
