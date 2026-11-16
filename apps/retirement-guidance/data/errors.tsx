import { useTranslation } from '@maps-react/hooks/useTranslation';

export type ErrorType = {
  question: number;
  message: string;
};

export const retirementGuidanceErrorMessages = (
  qNumber: number,
): Array<ErrorType> => {
  const { t } = useTranslation();

  const errorMessage = t(
    `q${qNumber}.errorSummaryDescription`,
    undefined,
    t('errorSummaryDescription'),
  );

  return [
    {
      question: qNumber,
      message: errorMessage,
    },
  ];
};
