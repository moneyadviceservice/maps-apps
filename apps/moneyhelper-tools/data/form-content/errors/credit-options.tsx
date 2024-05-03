import { useTranslation } from '@maps-digital/shared/hooks';

export type ErrorType = {
  question: number;
  message: string;
};

export const creditOptionsErrorMessages = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<ErrorType> => {
  return [
    {
      question: 0, // Default error message
      message: z({
        en: 'Please select an answer',
        cy: 'Dewiswch ateb',
      }),
    },
    {
      question: 1,
      message: z({
        en: 'Enter an amount up to £50,000',
        cy: 'Dewiswch ateb',
      }),
    },
  ];
};
