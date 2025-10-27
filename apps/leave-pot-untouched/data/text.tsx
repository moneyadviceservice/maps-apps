import useTranslation from '@maps-react/hooks/useTranslation';
import { pensionToolsContent } from '@maps-react/pension-tools/data/pensionToolsContent';
import { PensionPotCalculatorType } from '@maps-react/pension-tools/types';

export const monthInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  return {
    questionNbr: questionNbr,
    group: 'MoneyInput',
    answers: [],
    type: 'month',
    title: z({
      en: 'How much can you pay in each month?',
      cy: 'Faint allwch chi ei dalu i mewn bob mis?',
    }),
    errors: {
      invalid: z({
        en: 'Use numbers only',
        cy: 'Defnyddiwch rifau yn unig',
      }),
    },
  };
};

export const leavePotUntouchedContent = (
  t: ReturnType<typeof useTranslation>['z'],
): PensionPotCalculatorType => {
  return {
    ...pensionToolsContent(t),
    title: t({
      en: 'Estimate how much your pot could grow',
      cy: 'Amcangyfrif o faint allai eich cronfa dyfu',
    }),
    calloutMessageResults: t({
      en: (
        <ul className="list-disc pl-6">
          <li className="mb-2">
            This is an estimate based on your whole pot growing at a rate of
            about 3% per year — this may vary.
          </li>
          <li className="mb-2">
            The amount in your pot will be affected by inflation and any fees
            your provider charges.
          </li>
          <li>
            You must leave your whole pot — you can{"'"}t take just the 25%
            tax-free lump sum and leave the rest.
          </li>
        </ul>
      ),
      cy: (
        <ul className="list-disc pl-6">
          <li className="mb-2">
            Mae hwn yn amcangyfrif yn seiliedig ar eich cronfa gyfan yn tyfu ar
            gyfradd o tua 3% y flwyddyn — gallai hyn amrywio.
          </li>
          <li className="mb-2">
            Bydd y swm yn eich cronfa yn cael ei effeithio gan chwyddiant ac
            unrhyw ffioedd mae eich darparwr yn eu codi.
          </li>
          <li>
            Mae{"'"}n rhaid i chi adael eich gornfa gyfan — ni allwch gymryd y
            lwmp swm 25% di-dreth a gadael y gweddill.
          </li>
        </ul>
      ),
    }),
  };
};
