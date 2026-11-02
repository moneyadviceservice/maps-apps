import { Link } from '@maps-react/common/components/Link';
import { type Question } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const incomeInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
): Question => {
  return {
    questionNbr: questionNbr,
    group: 'MoneyInput',
    answers: [],
    type: 'income',
    title: z({
      en: 'What is your yearly income?',
      cy: 'Beth yw eich incwm blynyddol?',
    }),
    errors: {
      required: z({
        en: 'Enter a figure',
        cy: 'Rhowch ffigwr',
      }),
      invalid: z({
        en: 'Use numbers only',
        cy: 'Defnyddiwch rifau yn unig',
      }),
    },
    description: z({
      en: (
        <>
          Include any taxable income you get, such as your wages, certain
          benefits and the State Pension. For more information, see{' '}
          <Link
            asInlineText
            target="_blank"
            withIcon={false}
            href="https://www.gov.uk/income-tax/taxfree-and-taxable-state-benefits"
          >
            <span>which benefits are taxable</span>
            <span className="sr-only">(opens in new tab)</span>
          </Link>
        </>
      ),
      cy: (
        <>
          Dylech gynnwys unrhyw incwm trethadwy rydych chi’n ei gael, fel eich
          cyflog, fudd-daliadau penodol a Phensiwn y Wladwriaeth. Am fwy o
          wybodaeth, gweler{' '}
          <Link
            asInlineText
            target="_blank"
            withIcon={false}
            href="https://www.gov.uk/income-tax/taxfree-and-taxable-state-benefits"
          >
            <span>pa fudd-daliadau sy’n drethadwy</span>
            <span className="sr-only">(yn agor mewn tab newydd)</span>
          </Link>
        </>
      ),
    }),
  };
};

export const potInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
): Question => {
  return {
    questionNbr: questionNbr,
    group: 'MoneyInput',
    answers: [],
    type: 'pot',
    title: z({
      en: 'How much is your pension currently worth?',
      cy: 'Beth yw gwerth presennol eich pensiwn?',
    }),
    errors: {
      required: z({
        en: 'Enter a figure',
        cy: 'Rhowch ffigwr',
      }),
      invalid: z({
        en: 'Use numbers only',
        cy: 'Defnyddiwch rifau yn unig',
      }),
      min: z({
        en: 'Amount must be at least £1',
        cy: `Mae'n rhaid i'r swm fod o leiaf £1`,
      }),
    },
  };
};
export const chunkInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
): Question => {
  return {
    questionNbr: questionNbr,
    group: 'MoneyInput',
    answers: [],
    type: 'chunk',
    title: z({
      en: 'How much do you want to take as your first cash chunk?',
      cy: 'Faint ydych chi eisiau ei gymryd allan fel eich swm cyntaf o arian?',
    }),
    errors: {
      required: z({
        en: 'Enter a figure',
        cy: 'Rhowch ffigwr',
      }),
      invalid: z({
        en: 'Use numbers only',
        cy: 'Defnyddiwch rifau yn unig',
      }),
      min: z({
        en: 'Amount must be at least £1',
        cy: `Mae'n rhaid i'r swm fod o leiaf £1`,
      }),
      max: z({
        en: 'Amount must be less than your pension pot value',
        cy: `Mae'n rhaid i'r swm fod yn llai na gwerth eich cronfa bensiwn`,
      }),
    },
  };
};
export const updateChunkInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
): Question => {
  return {
    questionNbr: questionNbr,
    group: 'MoneyInput',
    answers: [],
    type: 'updateChunk',
    title: z({
      en: 'or try a different cash chunk:',
      cy: 'neu rhowch gynnig ar swm gwahanol o arian:',
    }),
    errors: {
      required: z({
        en: 'Enter a figure',
        cy: 'Rhowch ffigwr',
      }),
      invalid: z({
        en: 'Use numbers only',
        cy: 'Defnyddiwch rifau yn unig',
      }),
      max: z({
        en: 'Amount must be less than your pension pot value',
        cy: `Mae'n rhaid i'r swm fod yn llai na gwerth eich cronfa bensiwn`,
      }),
    },
  };
};

export const ageInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
): Question => {
  return {
    questionNbr: questionNbr,
    group: 'NumberInput',
    answers: [],
    type: 'age',
    title: z({
      en: 'What age do you want to start taking money?',
      cy: 'Pa oedran ydych chi eisiau cymryd eich arian?',
    }),
    errors: {
      required: z({
        en: 'Enter a figure',
        cy: 'Rhowch ffigwr',
      }),
      max: z({
        en: 'Enter the age you’d like the income to start, from 55 to 75.',
        cy: `Rhowch yr oedran yr hoffech i'r incwm ddechrau, o 55 i 75 oed.`,
      }),
    },
  };
};

export const monthUpdateInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
): Question => {
  return {
    questionNbr: questionNbr,
    group: 'NumberInput',
    answers: [],
    type: 'updateMonth',
    title: z({
      en: 'or try paying in a different amount each month:',
      cy: 'neu rhowch gynnig ar dalu swm gwahanol i mewn bob mis:',
    }),
    errors: {
      required: z({
        en: 'Enter a figure',
        cy: 'Rhowch ffigwr',
      }),
      invalid: z({
        en: 'Use numbers only',
        cy: 'Defnyddiwch rifau yn unig',
      }),
    },
  };
};
