import { ListElement } from '@maps-react/common/components/ListElement/ListElement';
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
      en: 'Estimate how much your pension could be worth',
      cy: 'Amcangyfrif o faint y gallai eich pensiwn fod yn werth',
    }),
    calloutMessageResults: t({
      en: (
        <>
          <div>
            Your estimated pension values are not guaranteed and assume:
          </div>
          <ListElement
            variant="unordered"
            color="dark"
            className="pt-6 pb-4 pl-10 pr-8 list-inside"
            items={[
              'your invested pension grows around 3% per year',
              'you do not take out any money, including any tax-free lump sum.',
            ]}
          />
          <div>
            It does not consider the effect of inflation or any fees your
            provider charges.
          </div>
        </>
      ),
      cy: (
        <>
          <div>
            Nid yw amcangyfrif gwerth eich pensiwn wedi’i warantu ac mae’n
            tybio:
          </div>
          <ListElement
            variant="unordered"
            color="dark"
            className="pt-6 pb-4 pl-10 pr-8 list-inside"
            items={[
              'bydd eich pensiwn sydd wedi’i fuddsoddi yn tyfu ar gyfradd o tua 3% y flwyddyn',
              'nad ydych yn cymryd unrhyw arian, gan gynnwys unrhyw gyfandaliadau di-dreth.',
            ]}
          />
          <div>
            Nid yw’n ystyried effaith chwyddiant na unrhyw ffioedd bydd eich
            darparwr yn codi arnoch.
          </div>
        </>
      ),
    }),
  };
};
