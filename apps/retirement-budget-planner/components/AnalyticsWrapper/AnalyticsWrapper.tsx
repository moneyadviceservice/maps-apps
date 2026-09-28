import { ComponentProps, PropsWithChildren } from 'react';

import { PAGES_NAMES, PAGES_NAMES_EXTRA } from 'lib/constants/pageConstants';
import { useRbpAnalytics } from 'lib/hooks/useRbpAnalytics';

import { Analytics } from '@maps-react/core/components/Analytics';

export type AnalyticsWrapperProps = PropsWithChildren<
  Partial<
    Pick<ComponentProps<typeof Analytics>, 'errors' | 'trackDefaults'>
  > & {
    tabName: PAGES_NAMES | PAGES_NAMES_EXTRA;
  }
>;

export const AnalyticsWrapper = ({
  children,
  tabName,
  errors,
  trackDefaults,
}: AnalyticsWrapperProps) => {
  const { analyticsData, lastStep } = useRbpAnalytics(tabName);

  return (
    <Analytics
      analyticsData={analyticsData}
      currentStep={analyticsData.tool.toolStep}
      lastStep={lastStep}
      formData={{}}
      errors={errors}
      trackDefaults={
        trackDefaults || {
          pageLoad: true,
          toolStartRestart: true,
          toolCompletion: true,
          errorMessage: true,
          emptyToolCompletion: true,
        }
      }
    >
      {children}
    </Analytics>
  );
};
