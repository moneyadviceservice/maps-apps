import { useEffect } from 'react';

import { TOOL_NAME } from 'lib/constants';

import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type RetirementGuidanceAnalyticsProps = {
  pageName: string;
  pageTitle: string;
  toolStep: string;
  stepName: string;
  fireToolStart?: boolean;
  fireToolComplete?: boolean;
  hasError?: boolean;
  errorMessage?: string;
};

export const useRetirementGuidanceAnalytics = ({
  pageName,
  pageTitle,
  toolStep,
  stepName,
  fireToolStart = false,
  fireToolComplete = false,
  hasError = false,
  errorMessage,
}: RetirementGuidanceAnalyticsProps) => {
  const { addEvent } = useAnalytics();
  const { locale } = useTranslation();

  useEffect(() => {
    addEvent({
      event: 'pageLoadReact',
      page: {
        pageName: hasError ? `${pageName}-error` : pageName,
        pageTitle: hasError ? `${pageTitle} Error` : pageTitle,
        lang: locale,
        categoryLevels: ['Pensions & retirement', 'pensions explained'],
        site: 'moneyhelper',
        pageType: 'tool page',
      },
      tool: {
        toolName: TOOL_NAME,
        toolCategory: 'Complex Tool',
        toolStep,
        stepName: hasError ? `${stepName} Validation Error` : stepName,
      },
    });

    if (fireToolStart) {
      addEvent({
        event: 'toolStart',
        tool: {
          toolName: TOOL_NAME,
          toolCategory: 'Complex Tool',
          toolStep,
          stepName,
        },
      });
    }

    if (fireToolComplete) {
      addEvent({
        event: 'toolCompletion',
        tool: {
          toolName: TOOL_NAME,
          toolCategory: 'Complex Tool',
          toolStep,
          stepName,
          completionStatus: 'completed',
        },
      });
    }

    if (hasError && errorMessage) {
      addEvent({
        event: 'toolError',
        tool: {
          toolName: TOOL_NAME,
          toolCategory: 'Complex Tool',
          toolStep,
          stepName,
          errorType: 'Validation Error',
          errorMessage: `${errorMessage}`,
        },
      });
    }
  }, [
    addEvent,
    locale,
    pageName,
    pageTitle,
    toolStep,
    stepName,
    fireToolStart,
    fireToolComplete,
    hasError,
    errorMessage,
  ]);
};
