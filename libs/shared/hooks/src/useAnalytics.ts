import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useRouter } from 'next/router';

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
  page?: {
    lang?: string;
    pageName?: string;
    pageTitle?: string;
    categoryLevels?: string[];
    pageType?: string;
    site?: string;
    source?: string;
    url?: string;
  };
  tool?: {
    stepName?: string;
    toolCategory?: string;
    toolName?: string;
    toolStep?: string | number;
    mortgageType?: string;
    outcome?: {
      [key: string]: string | number;
    };
  };
  event?: string;
  errorDetails?: ErrorDetails[];
  eventInfo?: {
    toolName?: string;
    toolStep?: string | number;
    stepName?: string;
    actionPlan?: string;
    reactCompType?: string;
    reactCompName?: string;
    fieldValue?: string;
    errorDetails?: EventErrorDetails[] | ErrorDetails[];
    linkText?: string;
    destinationURL?: string;
  };
  linkInfo?: {
    linkName: string;
    linkType: string;
  };
  user?: {
    loggedIn?: boolean;
    userId?: string;
    sessionId?: string;
  };
  demo?: {
    emolument?: number;
    emolumentMerged?: number;
    bYear?: number | string;
    isRent?: boolean;
    isChildCarer?: boolean;
    isSoleChildCarer?: boolean;
    isHealth?: boolean;
    isMHealth?: boolean;
  };
  searchResults?: Record<string, unknown>;
}

export interface AnalyticsPageData {
  pageName: string;
  pageTitle: string;
  categoryLevels?: string[];
  toolName: string;
  stepNames: string[];
}

export interface ErrorDetails {
  fieldType: string | undefined;
  fieldName: string | undefined;
  errorMessage: string | undefined;
}

export interface EventErrorDetails {
  reactCompType: string;
  reactCompName: string;
  errorMessage: string;
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
      source: router.query.isEmbedded === 'true' ? 'embedded' : 'direct',
    };
  }, [router.query.language, router.query.isEmbedded]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.adobeDataLayer) {
      window.adobeDataLayer = [];
    }
  }, []);

  const addEvent = useCallback(
    (data: AnalyticsData) => {
      const toolCategory = data.tool?.toolCategory ?? '';
      const toolStep = data.tool?.toolStep ?? '';
      const user = data.user;

      const url =
        window?.location !== window?.parent.location
          ? document.referrer
          : document.location.href;

      if (typeof window !== 'undefined' && !window.adobeDataLayer) {
        window.adobeDataLayer = [];
      }

      if (data.eventInfo) {
        window.adobeDataLayer?.push({
          event: data.event,
          eventInfo: data.eventInfo,
          ...(user?.userId && { user: user }),
        });
      } else {
        window.adobeDataLayer?.push({
          page: {
            pageName: data.page?.pageName ?? '',
            pageTitle: data.page?.pageTitle ?? '',
            ...pageExtraFields,
            ...getCategoryLevels(data.page?.categoryLevels ?? []),
            url,
            pageType: data.page?.pageType ?? pageExtraFields.pageType,
            site:
              url.includes('moneyhelper') || url.includes('localhost')
                ? 'moneyhelper'
                : 'partner',
          },
          tool: { ...data.tool, toolCategory, toolStep },
          event: data.event,
          ...(data.demo && { demo: data.demo }),
          ...(user?.userId && { user: user }),
          ...(data.searchResults && { searchResults: data.searchResults }),
        });
      }
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

  const getCategoryLevels = (categoryLevels: string[]) => {
    let categories: { [key: string]: string }[] = [];
    if (!categoryLevels) return {};
    categoryLevels?.forEach((category: string, index: number) => {
      const categoryValue: { [key: string]: string } = {};
      categoryValue[`categoryL${index + 1}`] = category;
      categories = { ...categories, ...categoryValue };
    });

    return categories;
  };
  const addPage = (data: AnalyticsData[]) => {
    data.forEach((d) => {
      analyticsList.current.push({
        event: d.event,
        page: {
          pageName: d.page?.pageName ?? '',
          pageTitle: d.page?.pageTitle ?? '',
          categoryLevels: d.page?.categoryLevels ?? [],
          ...pageExtraFields,
        },
        tool: {
          toolName: d.tool?.toolName ?? '',
          toolCategory: d.tool?.toolCategory ?? '',
          toolStep: d.tool?.toolStep ?? '',
          stepName: d.tool?.stepName ?? '',
          ...(d.tool?.outcome && { outcome: d.tool.outcome }),
        },
        ...(d.demo && { demo: d.demo }),
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
        categoryLevels: analyticsData?.categoryLevels,
      },
      tool: {
        toolName: analyticsData?.toolName,
        toolStep: currentStep,
        stepName: step,
      },
      // demo: {
      //   emolument?: number;
      //   emolumentMerged?: number;
      //   bYear?: number;
      //   isRent: boolean;
      //   isChildCarer: boolean;
      //   isSoleChildCarer: boolean;
      //   isHealth: boolean;
      //   isMHealth: boolean;
      // },
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
