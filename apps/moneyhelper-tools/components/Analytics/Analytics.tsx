import { FormData } from 'data/types';
import {
  useAnalytics,
  AnalyticsData,
  EventErrorDetails,
} from 'hooks/useAnalytics';
import { useRouter } from 'next/router';
import { PropsWithChildren, useEffect, useCallback, useRef } from 'react';

type TrackEvents = {
  pageLoad: boolean;
  toolStartRestart: boolean;
  toolCompletion: boolean;
  errorMessage: boolean;
};

type EventInfo = {
  toolName: string;
  toolStep: string;
  stepName: string;
  errorDetails: EventErrorDetails[];
};

type Props = {
  analyticsData: AnalyticsData;
  currentStep: number | string;
  formData: FormData;
  trackDefaults?: TrackEvents;
  errors?: EventErrorDetails[];
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

  const { pageLoad, toolStartRestart, toolCompletion, errorMessage } =
    trackDefaults;

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
    if (!trackingStartedRef.current && pageLoad && currentStep) {
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
        Object.keys(formData).length
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
  ]);

  useEffect(() => {
    if (!errorTrackedRef.current && errorMessage && errors?.length) {
      const eventInfo = {
        toolName: analyticsData.tool.toolName ?? '',
        toolStep: `${analyticsData.tool.toolStep}`,
        stepName: analyticsData.tool.stepName ?? '',
        errorDetails: errors,
      };
      fireEvent('errorMessage', eventInfo);
      errorTrackedRef.current = true;
    }
  }, [errorMessage, analyticsData, errors, fireEvent]);

  return <>{children}</>;
};
