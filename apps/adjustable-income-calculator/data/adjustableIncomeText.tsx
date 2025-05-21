import { Question } from '@maps-react/form/types';
import useTranslation from '@maps-react/hooks/useTranslation';
import {
  pensionToolsContent,
  sharedText,
} from '@maps-react/pension-tools/data/pensionToolsContent';
import {
  ageInput,
  monthUpdateInput,
  potInput,
} from '@maps-react/pension-tools/data/pensionToolsFormContent';
import { PensionPotCalculatorType } from '@maps-react/pension-tools/types';

export const getAjustableIncomeText = (
  t: ReturnType<typeof useTranslation>['z'],
): PensionPotCalculatorType => {
  return {
    ...pensionToolsContent(t),
    calloutMessageResults: t({
      en: (
        <>
          <li className="mb-2">
            You could pay Income Tax on your monthly income.
          </li>
          <li className="mb-2">
            This is an estimate based on the amount in your pot growing at a
            rate of about 3% per year — this may vary.
          </li>
          <li className="mb-2">
            No allowance has been made for inflation, you may wish to consider
            how this will affect the buying power of this income.
          </li>
          <li>
            If you have a very large pot, your tax-free amount could be
            different. This depends on whether you’ve gone over the lifetime
            allowance (LTA), whether you’ve registered for LTA protection,
            whether you are liable for LTA tax charges, and whether you’ve
            already taken money from your pot.
          </li>
        </>
      ),
      cy: (
        <>
          <li className="mb-2">
            Gallech dalu Treth Incwm ar eich incwm misol.
          </li>
          <li className="mb-2">
            Mae hwn yn amcangyfrif yn seiliedig ar y swm yn eich cronfa yn tyfu
            ar gyfradd o tua 3% y flwyddyn — gallai hyn amrywio.
          </li>
          <li className="mb-2">{sharedText.textLine2}</li>
          <li>
            Os oes gennych gronfa fawr iawn, gallai eich swm di-dreth fod yn
            wahanol. Mae hyn yn dibynnu a ydych wedi mynd dros y lwfans oes
            (LTA), p’un a ydych wedi cofrestru ar gyfer amddiffyniad LTA, a
            ydych yn atebol am daliadau treth LTA, ac a ydych eisoes wedi cymryd
            arian o’ch cronfa.
          </li>
        </>
      ),
    }),
  };
};

export const getAdjustableIncomeContent = (
  z: ReturnType<typeof useTranslation>['z'],
): Question[] => {
  const pot = potInput(1, z);
  const age = ageInput(2, z);
  return [
    {
      ...pot,
      errors: {
        ...pot.errors,
        max: z({
          en: 'Amount must be less than £5,000,000',
          cy: `Mae'n rhaid i'r swm fod yn llai na £5,000,000`,
        }),
      },
    },
    {
      ...age,
      errors: {
        min: z({
          en: 'Enter an age over 55',
          cy: `Rhowch oed dros 55`,
        }),
      },
    },
    {
      ...monthUpdateInput(3, z),
      title: z({
        en: 'or try a different monthly income:',
        cy: 'neu rhowch gynnig ar incwm misol gwahanol:',
      }),
    },
  ];
};
