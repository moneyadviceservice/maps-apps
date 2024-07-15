import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef } from 'react';

declare global {
  interface Window {
    adobeDataLayer: Array<Record<string, unknown>>;
  }
}

export interface AnalyticsResult {
  addPage: (data: AnalyticsData[]) => void;
  addStepPage: (
    data: AnalyticsPageData,
    currentStep: string | number,
    stepName?: string,
  ) => void;
  addEvent: (data: AnalyticsData) => void;
  analyticsList: React.MutableRefObject<AnalyticsData[]>;
}

export interface AnalyticsData {
  page: {
    lang?: string;
    pageName?: string;
    pageTitle?: string;
    pageType?: string;
    site?: string;
  };
  tool: {
    stepName?: string;
    toolCategory?: string;
    toolName?: string;
    toolStep?: string | number;
  };
  event?: string;
  errorDetails?: ErrorDetails[];
}

export interface AnalyticsPageData {
  pageName: string;
  pageTitle: string;
  toolName: string;
  stepNames: string[];
}

export interface ErrorDetails {
  fieldType: string | undefined;
  fieldName: string | undefined;
  errorMessage: string | undefined;
}

export interface AnalyticsPageData {
  pageName: string;
  pageTitle: string;
  toolName: string;
  stepNames: string[];
}

export const useAnalytics = (): AnalyticsResult => {
  const analyticsList = useRef<AnalyticsData[]>([]);
  const addToLayer = useRef<boolean>(false);
  const router = useRouter();

  const pageExtraFields = useMemo(() => {
    return {
      lang: router.query.language === 'cy' ? 'cy' : 'en',
      site: 'moneyhelper',
      pageType: 'tool page',
    };
  }, [router.query.language]);

  const addEvent = useCallback(
    (data: AnalyticsData) => {
      const toolCategory = data.tool?.toolCategory ?? '';
      const toolStep = data.tool?.toolStep ?? '';

      window.adobeDataLayer.push({
        page: { ...data.page, ...pageExtraFields },
        tool: { ...data.tool, toolCategory, toolStep },
        event: data.event,
      });
    },
    [pageExtraFields],
  );

  useEffect(() => {
    const updateAdobeDataLayer = () => {
      if (
        window.adobeDataLayer &&
        analyticsList.current &&
        !addToLayer.current
      ) {
        analyticsList.current.forEach((page) => {
          addEvent(page);
        });
        addToLayer.current = true;
      }
    };

    updateAdobeDataLayer();
  }, [router.asPath, router.query.language, addEvent]);

  const addPage = (data: AnalyticsData[]) => {
    data.forEach((d) => {
      analyticsList.current.push({
        event: d.event,
        page: {
          pageName: d.page.pageName ?? '',
          pageTitle: d.page.pageTitle ?? '',
          ...pageExtraFields,
        },
        tool: {
          toolName: d.tool.toolName ?? '',
          toolCategory: d.tool.toolCategory ?? '',
          toolStep: d.tool.toolStep ?? '',
          stepName: d.tool.stepName ?? '',
        },
      });
    });
  };

  const addStepPage = (
    analyticsData: AnalyticsPageData,
    currentStep: number | string,
    stepName?: string,
  ) => {
    const step = stepName ?? analyticsData?.stepNames[Number(currentStep) - 1];

    const initialPageData = {
      page: {
        pageName: analyticsData?.pageName,
        pageTitle: analyticsData?.pageTitle,
      },
      tool: {
        toolName: analyticsData?.toolName,
        toolStep: currentStep,
        stepName: step,
      },
      event: 'pageLoadReact',
    };

    addPage([initialPageData]);
  };

  return {
    addPage,
    addStepPage,
    addEvent,
    analyticsList,
  };
};
