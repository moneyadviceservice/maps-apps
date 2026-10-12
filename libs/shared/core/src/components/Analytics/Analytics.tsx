import { PropsWithChildren, useCallback, useEffect, useRef } from 'react';

import { useRouter } from 'next/router';

import {
  AnalyticsData,
  ErrorDetails,
  EventErrorDetails,
  useAnalytics,
} from '@maps-react/hooks/useAnalytics';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

type TrackEvents = {
  pageLoad: boolean;
  toolStartRestart: boolean;
  toolCompletion: boolean;
  errorMessage: boolean;
  emptyToolCompletion?: boolean;
};

type EventInfo = {
  toolName: string;
  toolStep: string;
  stepName: string;
  errorDetails: EventErrorDetails[] | ErrorDetails[];
};

type Props = {
  analyticsData: AnalyticsData;
  currentStep: number | string;
  formData: DataFromQuery;
  trackDefaults?: TrackEvents;
  errors?: EventErrorDetails[] | ErrorDetails[];
  lastStep?: string | number;
};

export const Analytics = ({
  analyticsData,
  currentStep,
  formData,
  trackDefaults = {
    pageLoad: true,
    toolStartRestart: true,
    toolCompletion: true,
    errorMessage: true,
    emptyToolCompletion: false,
  },
  errors,
  lastStep,
  children,
}: Props & PropsWithChildren) => {
  const { addEvent } = useAnalytics();
  const router = useRouter();
  const restart = router.query.restart === 'true';
  const hasToolStarted = Object.keys(formData).length > 0;
  const trackingStartedRef = useRef(false);
  const lastStepTracked = useRef(currentStep);
  const toolStartEventPushedRef = useRef(false);
  const toolCompletionEventPushedRef = useRef(false);
  const errorTrackedRef = useRef(false);

  const {
    pageLoad,
    toolStartRestart,
    toolCompletion,
    errorMessage,
    emptyToolCompletion,
  } = trackDefaults;

  const handleSpaStepChange = useCallback(() => {
    lastStepTracked.current = currentStep;
    trackingStartedRef.current = false;
  }, [currentStep]);

  const fireEvent = useCallback(
    (event: string, eventInfo?: EventInfo) => {
      addEvent({
        ...analyticsData,
        event: event,
        eventInfo,
      });
    },
    [addEvent, analyticsData],
  );

  useEffect(() => {
    if (lastStepTracked.current !== currentStep) {
      handleSpaStepChange();
    }
  }, [lastStepTracked, currentStep, fireEvent, handleSpaStepChange]);

  useEffect(() => {
    if (!trackingStartedRef.current && pageLoad && currentStep !== undefined) {
      fireEvent('pageLoadReact');
      trackingStartedRef.current = true;
    }
  }, [pageLoad, currentStep, fireEvent, trackingStartedRef]);

  useEffect(() => {
    if (
      !toolStartEventPushedRef.current &&
      toolStartRestart &&
      currentStep === 1 &&
      (!hasToolStarted || restart)
    ) {
      fireEvent(restart ? 'toolRestart' : 'toolStart');
      toolStartEventPushedRef.current = true;
    }
  }, [
    toolStartRestart,
    currentStep,
    formData,
    hasToolStarted,
    restart,
    fireEvent,
  ]);

  useEffect(() => {
    if (
      !toolCompletionEventPushedRef.current &&
      toolCompletion &&
      currentStep === lastStep
    ) {
      fireEvent(
        Object.keys(formData).length || emptyToolCompletion
          ? 'toolCompletion'
          : 'toolCompletionNoInput',
      );
      toolCompletionEventPushedRef.current = true;
    }
  }, [
    toolCompletion,
    currentStep,
    formData,
    hasToolStarted,
    fireEvent,
    analyticsData,
    lastStep,
    emptyToolCompletion,
  ]);

  useEffect(() => {
    if (!errorTrackedRef.current && errorMessage && errors?.length) {
      const eventInfo = {
        toolName: analyticsData.tool?.toolName ?? '',
        toolStep: `${analyticsData.tool?.toolStep}`,
        stepName: analyticsData.tool?.stepName ?? '',
        errorDetails: errors,
      };
      fireEvent('errorMessage', eventInfo);
      errorTrackedRef.current = true;
    }
  }, [errorMessage, analyticsData, errors, fireEvent]);

  return <>{children}</>;
};
