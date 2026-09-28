import { useTranslation } from '@maps-react/hooks/useTranslation';

export type ErrorType = {
  question: number;
  message: string;
};

export const creditRejectionErrorMessages = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<ErrorType> => {
  return [
    {
      question: 0, // Default error message
      message: z({ en: 'Please select an answer', cy: 'Dewiswch ateb' }),
    },
  ];
};
