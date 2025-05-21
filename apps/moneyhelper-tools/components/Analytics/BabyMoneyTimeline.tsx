import { PropsWithChildren } from 'react';

import { babyMoneyTimelineAnalytics } from 'data/form-content/analytics/baby-money-timeline';
import { BabyMoneyTabIndex } from 'pages/[language]/baby-money-timeline/[tab]';

import { Analytics } from '@maps-react/core/components/Analytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  currentStep: BabyMoneyTabIndex | 'landing';
};

export const BabyMoneyTimelineAnalytics = ({
  currentStep,
  children,
}: Props & PropsWithChildren) => {
  const { z } = useTranslation();
  const analyticsData = babyMoneyTimelineAnalytics(z, currentStep);

  return (
    <Analytics
      analyticsData={analyticsData}
      currentStep={currentStep}
      formData={{}}
      lastStep={6}
      errors={[]}
      trackDefaults={{
        toolCompletion: true,
        toolStartRestart: true,
        errorMessage: true,
        pageLoad: true,
        emptyToolCompletion: true,
      }}
    >
      {children}
    </Analytics>
  );
};
