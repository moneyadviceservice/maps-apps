import { PropsWithChildren, useCallback, useEffect, useRef } from 'react';

import { bccAnalyticsData } from 'data/form-content/analytics';
import { FormData } from 'data/types';
import { useAnalytics } from 'hooks/useAnalytics';
import { BabyCostTabIndex } from 'pages/[language]/baby-cost-calculator/[tab]';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { Analytics } from './Analytics';

type EventInfo = {
  toolName: string;
  toolStep: string;
  stepName: string;
  errorDetails: {
    reactCompType: string;
    reactCompName: string;
    errorMessage: string;
  }[];
};

type Props = {
  currentTab: BabyCostTabIndex | 'save' | 'saved';
  formData: FormData;
  resultsTotal?: number;
  error?: string;
};

export const BabyCostsAnalytics = ({
  currentTab,
  formData,
  resultsTotal,
  error,
  children,
}: Props & PropsWithChildren) => {
  const { z } = useTranslation();
  const { addEvent } = useAnalytics();

  const pageData = bccAnalyticsData(z, currentTab);
  const hasToolStarted = Object.keys(formData).length > 0;

  const toolCompletionEventPushedRef = useRef(false);
  const errorTrackedRef = useRef(false);

  const fireEvent = useCallback(
    (event: string, eventInfo?: EventInfo) => {
      addEvent({
        ...pageData,
        event: event,
        eventInfo,
      });
    },
    [addEvent, pageData],
  );

  useEffect(() => {
    const babyDue = formData['baby-due'];
    if (!toolCompletionEventPushedRef.current && currentTab === 5) {
      fireEvent(
        !(babyDue === '9' && resultsTotal === 0)
          ? 'toolCompletion'
          : 'toolCompletionNoInput',
      );
      toolCompletionEventPushedRef.current = true;
    }
  }, [currentTab, formData, hasToolStarted, resultsTotal, fireEvent]);

  useEffect(() => {
    if (!errorTrackedRef.current && currentTab === 'save' && error) {
      const eventInfo = {
        toolName: 'Baby Costs Calculator',
        toolStep: '',
        stepName: '',
        errorDetails: [
          {
            reactCompType: 'TextInput',
            reactCompName: 'Your email address',
            errorMessage: error,
          },
        ],
      };
      fireEvent('errorMessage', eventInfo);
    }

    errorTrackedRef.current = true;
  }, [currentTab, error, fireEvent]);

  const trackDefaults = {
    pageLoad: true,
    toolStartRestart: true,
    toolCompletion: false,
    errorMessage: false,
  };

  return (
    <Analytics
      analyticsData={bccAnalyticsData(z, currentTab)}
      currentStep={currentTab}
      formData={formData}
      trackDefaults={trackDefaults}
    >
      {children}
    </Analytics>
  );
};
