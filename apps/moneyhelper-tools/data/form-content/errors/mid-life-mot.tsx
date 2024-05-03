import { useTranslation } from '@maps-digital/shared/hooks';

export type ErrorType = {
  question: number;
  message: string;
};

export const midLifeMotErrorMessages = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<ErrorType> => {
  return [
    {
      question: 0, // Default error message
      message: z({ en: 'Please select an answer', cy: 'Dewiswch ateb' }),
    },
  ];
};
