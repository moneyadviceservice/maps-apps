import { PropsWithChildren } from 'react';

import { pensionTypeAnalytics } from 'data/form-content/analytics';
import { FormData } from 'data/types';
import { PensionTypeSteps } from 'pages/[language]/pension-type';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { Analytics } from './Analytics';

type Props = {
  currentStep: PensionTypeSteps;
  formData: FormData;
  error?: {
    reactCompType: string;
    reactCompName: string;
    errorMessage: string;
  };
};

export const PensionTypeAnalytics = ({
  currentStep,
  formData,
  error,
  children,
}: Props & PropsWithChildren) => {
  const { z } = useTranslation();
  const analyticsData = pensionTypeAnalytics(z, currentStep);

  return (
    <Analytics
      analyticsData={analyticsData}
      currentStep={currentStep}
      formData={formData}
      lastStep={6}
      errors={error && [error]}
    >
      {children}
    </Analytics>
  );
};
