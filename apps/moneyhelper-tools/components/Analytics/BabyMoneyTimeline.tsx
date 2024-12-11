import { PropsWithChildren } from 'react';

import { babyMoneyTimelineAnalytics } from 'data/form-content/analytics/baby-money-timeline';
import { BabyMoneyTabIndex } from 'pages/[language]/baby-money-timeline/[tab]';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { Analytics } from './Analytics';

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
    >
      {children}
    </Analytics>
  );
};
