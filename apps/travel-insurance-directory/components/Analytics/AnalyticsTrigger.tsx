import { PropsWithChildren, useEffect, useRef } from 'react';

import { RegistrationFlows } from 'lib/analytics/generateAnalyticsData';

import { Analytics } from '@maps-react/core/components/Analytics';
import { AnalyticsData, useAnalytics } from '@maps-react/hooks/useAnalytics';

export type TrackEvents = {
  pageLoad: boolean;
  toolStartRestart: boolean;
  toolCompletion: boolean;
  errorMessage: boolean;
  emptyToolCompletion?: boolean;
};

type Props = {
  analyticsData: AnalyticsData;
  currentStep?: number | string;
  currentFlow?: RegistrationFlows;
  lastStep?: string;
  trackEvents?: TrackEvents;
  error?: {
    reactCompType: string;
    reactCompName: string;
    errorMessage: string;
  }[];
};

const trackDefaults = {
  pageLoad: true,
  toolStartRestart: false,
  toolCompletion: true,
  errorMessage: true,
  emptyToolCompletion: true,
};

export const AnalyticsTrigger = ({
  analyticsData,
  currentStep,
  currentFlow,
  lastStep = '21',
  trackEvents = trackDefaults,
  error,
  children,
}: Props & PropsWithChildren) => {
  const { addEvent } = useAnalytics();

  const toolStartEventPushedRef = useRef(false);

  useEffect(() => {
    if (
      !toolStartEventPushedRef.current &&
      currentStep === '1' &&
      currentFlow === 'user'
    ) {
      addEvent({
        ...analyticsData,
        event: 'toolStart',
      });
      toolStartEventPushedRef.current = true;
    }
  }, [currentStep, currentFlow, addEvent, analyticsData]);

  return (
    <Analytics
      analyticsData={analyticsData}
      currentStep={Number(analyticsData.tool?.toolStep ?? '0')}
      formData={{}}
      trackDefaults={trackEvents}
      lastStep={Number(lastStep)}
      errors={error || []}
    >
      {children}
    </Analytics>
  );
};
