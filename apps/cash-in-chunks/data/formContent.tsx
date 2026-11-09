import useTranslation from '@maps-react/hooks/useTranslation';

export const chunkInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  return {
    questionNbr: questionNbr,
    group: 'MoneyInput',
    answers: [],
    type: 'chunk',
    title: z({
      en: 'How much do you want to take as a lump sum?',
      cy: 'Faint ydych chi eisiau ei gymryd fel cyfandaliad?',
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
export const updateChunkInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  return {
    questionNbr: questionNbr,
    group: 'MoneyInput',
    answers: [],
    type: 'updateChunk',
    title: z({
      en: 'See what happens if you take a different amount:',
      cy: 'Gweler beth fydd yn digwydd os byddwch yn cymryd swm gwahanol:',
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
