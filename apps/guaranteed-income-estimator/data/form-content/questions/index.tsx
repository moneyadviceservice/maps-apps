import { type Question } from '@maps-react/form/types';
import useTranslation from '@maps-react/hooks/useTranslation';

export const guaranteedIncomeEstimatorQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
): Question[] => {
  return [potInput(1, z), ageInput(2, z)];
};

const potInput = (
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

const ageInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
): Question => {
  return {
    questionNbr: questionNbr,
    group: 'NumberInput',
    answers: [],
    type: 'age',
    title: z({
      en: 'What age do you want the income to start?',
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
