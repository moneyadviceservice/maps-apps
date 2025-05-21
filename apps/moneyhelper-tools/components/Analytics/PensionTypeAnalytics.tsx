import { PropsWithChildren } from 'react';

import { pensionTypeAnalytics } from 'data/form-content/analytics';
import { PensionTypeSteps } from 'pages/[language]/pension-type';

import { Analytics } from '@maps-react/core/components/Analytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormData } from '@maps-react/pension-tools/types/forms';

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
