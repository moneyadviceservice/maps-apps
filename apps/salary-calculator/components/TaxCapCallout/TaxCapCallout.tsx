import { useFocusOnMount } from 'hooks/useFocusOnMount';

import { H3 } from '@maps-react/common/components/Heading';
import {
  NotificationBox,
  NotificationBoxVariant,
} from '@maps-react/common/components/NotificationBox';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

interface TaxCapCalloutProps {
  grossIncome: number;
  uncappedIncomeTax: number;
  className?: string;
}

// check is the 50% tax cap applied (uncapped tax is strictly over 50% of gross)
export const isTaxCapApplied = (
  grossIncome: number,
  uncappedIncomeTax: number,
) => {
  return grossIncome > 0 && uncappedIncomeTax > grossIncome / 2;
};

export const TaxCapCallout = ({
  grossIncome,
  uncappedIncomeTax,
  className = '',
}: TaxCapCalloutProps) => {
  const { z } = useTranslation();
  const ref = useFocusOnMount<HTMLDivElement>();

  if (!isTaxCapApplied(grossIncome, uncappedIncomeTax)) {
    return null;
  }

  return (
    <div
      id="tax-cap-notification"
      data-testid="tax-cap-notification"
      ref={ref}
      tabIndex={-1}
      className={`col-span-12 xl:col-span-10 mb-6 lg:mb-8 focus:outline-none ${className}`}
    >
      <NotificationBox variant={NotificationBoxVariant.WARNING}>
        <H3 className="font-semibold mb-4 text-gray-800">
          {z({
            en: 'Your tax code has triggered a 50% tax cap',
            cy: 'Mae eich cod treth wedi sbarduno terfyn treth o 50%',
          })}
        </H3>

        <Paragraph className="mt-4">
          {z({
            en: 'It’s not possible for more than half of your gross salary to be taken as tax If you owe tax from past years - or have a significant change in circumstance a cap will apply to your tax bill. ',
            cy: "Ni ellir cymryd mwy na hanner eich cyflog gros fel treth os oes gennych dreth yn ddyledus o flynyddoedd blaenorol – neu os oes newid sylweddol yn eich amgylchiadau bydd terfyn yn berthnasol i'ch bil treth.",
          })}
        </Paragraph>

        <Paragraph>
          {z({
            en: 'This cap is 50% of your salary and means additional tax payments will potentially be spread over future pay periods.',
            cy: "Y terfyn yw 50% o'ch cyflog, sy'n golygu y gallai taliadau treth ychwanegol gael eu lledaenu dros gyfnodau talu yn y dyfodol.",
          })}
        </Paragraph>
      </NotificationBox>
    </div>
  );
};
