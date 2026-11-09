import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { ResultsCallout } from '../ResultsCallout';
import { ResultsCalloutWrapper } from '../ResultsCalloutWrapper';

interface TaxCapCalloutProps {
  grossIncome: number;
  uncappedIncomeTax: number;
  className?: string;
  showSkipToContent?: boolean;
}

// Checks whether uncapped income tax exceeds 50% of gross income.
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
  showSkipToContent = false,
}: TaxCapCalloutProps) => {
  const { z } = useTranslation();

  if (!isTaxCapApplied(grossIncome, uncappedIncomeTax)) {
    return null;
  }

  return (
    <ResultsCalloutWrapper id="tax-cap-notification" className={className}>
      <ResultsCallout
        showSkipToContent={showSkipToContent}
        title={z({
          en: 'Your tax code has triggered a 50% tax cap',
          cy: 'Mae eich cod treth wedi sbarduno terfyn treth o 50%',
        })}
      >
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
      </ResultsCallout>
    </ResultsCalloutWrapper>
  );
};
