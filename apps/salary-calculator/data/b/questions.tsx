import { Question } from '@maps-react/form/types';
import useTranslation from '@maps-react/hooks/useTranslation';

export const SalaryCalculatorQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
): Question[] => {
  return [
    {
      questionNbr: 1,
      title: z({
        en: 'What would you like to do?',
        cy: `Beth hoffech chi ei wneud?`,
      }),
      type: 'single',
      group: 'CalculationType',
      answers: [
        {
          text: z({
            en: 'Calculate take-home pay for one salary',
            cy: 'Cyfrifo cyflog cymryd adref am un cyflog',
          }),

          value: 'single',
        },
        {
          text: z({
            en: 'Compare take-home pay for two salaries',
            cy: 'Cymharu cyflog cymryd adref am ddau gyflog',
          }),
          value: 'joint',
        },
      ],
    },
  ];
};
