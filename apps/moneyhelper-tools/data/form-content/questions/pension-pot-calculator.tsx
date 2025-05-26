import { Link } from '@maps-react/common/components/Link';
import { Question } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

const incomeInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
) => {
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
        <p className="text-base text-gray-400 mb-2" aria-describedby="income">
          Include money you get from work, State Pension and any other taxable
          income you have. Find out more information on{' '}
          <Link
            asInlineText
            target="_blank"
            withIcon={false}
            href="https://www.gov.uk/income-tax/taxfree-and-taxable-state-benefits"
          >
            what other income is taxable (opens in new tab)
          </Link>
        </p>
      ),
      cy: (
        <p className="text-base text-gray-400 mb-2" aria-describedby="income">
          Cynhwyswch arian a gewch o{"'"}r gwaith, Pensiwn y Wladwriaeth ac
          unrhyw incwm trethadwy arall sydd gennych. Darganfyddwch ragor o
          wybodaeth ar{' '}
          <Link
            asInlineText
            target="_blank"
            withIcon={false}
            href="https://www.gov.uk/treth-incwm"
          >
            ba incwm arall sy{"'"}n drethadwy (yn agor mewn tab newydd)
          </Link>
        </p>
      ),
    }),
  };
};

const ageInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  return {
    questionNbr: questionNbr,
    group: 'NumberInput',
    answers: [],
    type: 'age',
    title: z({
      en: 'What age do you want to take your money?',
      cy: 'Pa oedran ydych chi eisiau cymryd eich arian?',
    }),
    errors: {
      required: z({
        en: 'Enter a figure',
        cy: 'Rhowch ffigwr',
      }),
      max: z({
        en: 'you can compare annuities on the MoneyHelper website',
        cy: `gallwch gymharu blwydd-daliadau ar y Gwefan HelpwrArian`,
      }),
      maxHTML: z({
        en: (
          <>
            <p className="inline">
              You must be aged 55 to 75 - you can compare annuities on the
            </p>{' '}
            <Link
              asInlineText
              target="_blank"
              href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/compare-annuities"
            >
              MoneyHelper website
            </Link>
          </>
        ),
        cy: (
          <>
            <p className="inline">
              Mae{"'"}n rhaid i chi fod yn 55 i 75 oed - gallwch gymharu
              blwydd-daliadau ar y
            </p>{' '}
            <Link
              asInlineText
              target="_blank"
              href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/compare-annuities"
            >
              Gwefan HelpwrArian
            </Link>
          </>
        ),
      }),
    },
  };
};

const potInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  return {
    questionNbr: questionNbr,
    group: 'MoneyInput',
    answers: [],
    type: 'pot',
    title: z({
      en: 'How much is in your pot?',
      cy: 'Faint sydd yn eich cronfa?',
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

const chunkInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
) => {
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
      max: z({
        en: 'Amount must be less than your pension pot value',
        cy: `Mae'n rhaid i'r swm fod yn llai na gwerth eich cronfa bensiwn`,
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

const monthInput = (
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

const monthUpdateInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
) => {
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

const updateChunkInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
) => {
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
      max: z({
        en: 'Amount must be less than your pension pot value',
        cy: `Mae'n rhaid i'r swm fod yn llai na gwerth eich cronfa bensiwn`,
      }),
      invalid: z({
        en: 'Use numbers only',
        cy: 'Defnyddiwch rifau yn unig',
      }),
    },
  };
};

export const cashInChunksQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
): Question[] => {
  return [
    incomeInput(1, z),
    potInput(2, z),
    chunkInput(3, z),
    updateChunkInput(4, z),
  ];
};

export const takeWholePotQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
): Question[] => {
  return [incomeInput(1, z), potInput(2, z)];
};

export const guaranteedIncomeEstimator = (
  z: ReturnType<typeof useTranslation>['z'],
): Question[] => {
  return [potInput(1, z), ageInput(2, z)];
};

export const leavePotUntouched = (
  z: ReturnType<typeof useTranslation>['z'],
): Question[] => {
  return [potInput(1, z), monthInput(2, z), monthUpdateInput(3, z)];
};

export const ajustableIncomeEstimator = (
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
