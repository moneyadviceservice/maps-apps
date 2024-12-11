import { PropsWithChildren, useMemo } from 'react';

import { macAnalyticsData } from 'data/form-content/analytics';
import { FormData } from 'data/types';
import { MacSteps } from 'pages/[language]/mortgage-affordability-calculator';
import { AcdlFieldError } from 'utils/TabToolUtils/generateFieldData/generateFieldData';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { Analytics } from './Analytics';

type Props = {
  currentStep: MacSteps;
  formData: FormData;
  acdlErrors?: AcdlFieldError;
  toolStarted?: boolean;
};

export const MACAnalytics = ({
  currentStep,
  formData,
  acdlErrors,
  toolStarted,
  children,
}: Props & PropsWithChildren) => {
  const { z } = useTranslation();
  const analyticsData = macAnalyticsData(z, currentStep);

  const getInputType = (errorField: string) => {
    if (errorField === 'r-term') {
      return 'NumberInput';
    } else if (errorField === 'r-interest') {
      return 'PercentageInput';
    } else {
      return 'MoneyInput';
    }
  };

  const analyticsErrors = useMemo(
    () =>
      acdlErrors &&
      Object.keys(acdlErrors).map((error) => {
        return {
          reactCompType: getInputType(error),
          reactCompName: acdlErrors[error].error.label,
          errorMessage: acdlErrors[error].error.message,
        };
      }),
    [acdlErrors],
  );

  return (
    <Analytics
      analyticsData={analyticsData}
      currentStep={currentStep}
      formData={formData}
      trackDefaults={{
        pageLoad: true,
        toolStartRestart: !!toolStarted,
        toolCompletion: true,
        errorMessage: true,
      }}
      errors={analyticsErrors}
      lastStep={3}
    >
      {children}
    </Analytics>
  );
};
