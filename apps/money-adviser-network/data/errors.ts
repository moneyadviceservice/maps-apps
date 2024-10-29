import { useTranslation } from '@maps-react/hooks/useTranslation';

export type ErrorType = {
  question: number;
  message: string;
};

export const errorMessages = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<ErrorType> => {
  return [
    {
      question: 0, // default if no specific question is supplied
      message: z({
        en: 'Please select an option to continue.',
        cy: 'Dewiswch opsiwn i barhau.',
      }),
    },
  ];
};
