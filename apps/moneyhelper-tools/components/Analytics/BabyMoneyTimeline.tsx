import { useTranslation } from '@maps-react/hooks/useTranslation';
import { PropsWithChildren } from 'react';
import { Analytics } from './Analytics';
import { babyMoneyTimelineAnalytics } from 'data/form-content/analytics/baby-money-timeline';
import { BabyMoneyTabIndex } from 'pages/[language]/baby-money-timeline/[tab]';

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
