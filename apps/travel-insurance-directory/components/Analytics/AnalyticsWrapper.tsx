import { PropsWithChildren } from 'react';

import {
  buildPageAnalyticsData,
  TRAVEL_INSURANCE_DIRECTORY_PAGE_ANALYTICS_TRACK_DEFAULTS,
  type TravelInsuranceDirectoryAnalyticsVariant,
} from 'lib/analytics/pageAnalytics';

import { Analytics } from '@maps-react/core/components/Analytics';

type Props = {
  variant: TravelInsuranceDirectoryAnalyticsVariant;
  currentStep?: number;
};

export const AnalyticsWrapper = ({
  variant,
  currentStep,
  children,
}: Props & PropsWithChildren) => {
  return (
    <Analytics
      analyticsData={buildPageAnalyticsData(variant)}
      currentStep={currentStep ?? 0}
      formData={{}}
      lastStep={2}
      errors={[]}
      trackDefaults={TRAVEL_INSURANCE_DIRECTORY_PAGE_ANALYTICS_TRACK_DEFAULTS}
    >
      {children}
    </Analytics>
  );
};
