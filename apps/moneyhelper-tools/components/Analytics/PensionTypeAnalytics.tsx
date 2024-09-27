import { FormData } from 'data/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { PropsWithChildren } from 'react';
import { Analytics } from './Analytics';
import { pensionTypeAnalytics } from 'data/form-content/analytics';
import { PensionTypeSteps } from 'pages/[language]/pension-type';

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
