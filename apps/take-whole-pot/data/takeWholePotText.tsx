import useTranslation from '@maps-react/hooks/useTranslation';
import {
  pensionToolsContent,
  sharedText,
} from '@maps-react/pension-tools/data/pensionToolsContent';
import { PensionPotCalculatorType } from '@maps-react/pension-tools/types';

export const takeWholePotText = (
  t: ReturnType<typeof useTranslation>['z'],
): PensionPotCalculatorType => {
  return {
    ...pensionToolsContent(t),
    title: t({
      en: 'Estimate what you’d get after tax',
      cy: 'Amcangyfrif o beth fyddwch yn ei gael ar ôl treth',
    }),
    calloutMessageResults: t({
      en: (
        <ul className="list-disc pl-6">
          <li className="mb-2">
            This calculation assumes you are entitled to 25% of your total pot
            as a tax-free lump sum.
          </li>
          <li>
            This is an estimate — the exact amount of tax you pay depends on
            your total income for the year and your tax rate.
          </li>
        </ul>
      ),
      cy: (
        <ul>
          <li>
            Mae{"'"}r cyfrifiad hwn yn tybio bod gennych hawl i 25% o gyfanswm
            eich pot fel cyfandaliad di-dreth.
          </li>
          <li>{sharedText.textLine1}</li>
          <li>{sharedText.textLine2}</li>
        </ul>
      ),
    }),
  };
};
