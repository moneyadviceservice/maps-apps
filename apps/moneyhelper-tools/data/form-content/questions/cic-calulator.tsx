import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Link } from '@maps-digital/shared/ui';
import { Question } from '@maps-react/form/types';

export const cashInChunksQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
): Question[] => {
  return [
    {
      questionNbr: 1,
      group: '',
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
              href="https://www.gov.uk/income-tax/taxfree-and-taxable-state-benefits"
            >
              what other income is taxable.
            </Link>
          </p>
        ),
        cy: (
          <p className="text-base text-gray-400 mb-2" aria-describedby="income">
            Cynhwyswch arian a gewch o'r gwaith, Pensiwn y Wladwriaeth ac unrhyw
            incwm trethadwy arall sydd gennych. Darganfyddwch ragor o wybodaeth
            ar{' '}
            <Link
              asInlineText
              target="_blank"
              href="https://www.gov.uk/treth-incwm"
            >
              ba incwm arall sy'n drethadwy.
            </Link>
          </p>
        ),
      }),
    },
    {
      questionNbr: 2,
      group: '',
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
      },
    },
    {
      questionNbr: 3,
      group: '',
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
      },
    },
  ];
};
