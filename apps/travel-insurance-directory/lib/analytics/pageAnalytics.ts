import type { AnalyticsData } from '@maps-react/hooks/useAnalytics';

export const TRAVEL_INSURANCE_DIRECTORY_PAGE_ANALYTICS_TRACK_DEFAULTS = {
  toolCompletion: false,
  toolStartRestart: false,
  errorMessage: false,
  pageLoad: true,
  emptyToolCompletion: false,
} as const;

export type TravelInsuranceDirectoryAnalyticsVariant =
  | 'landing'
  | 'viewFirms'
  | 'firmListings';

const CATEGORY_LEVELS = ['Everyday Money', 'Insurance'] as const;

const TOOL_BASE = {
  toolName: 'Travel Insurance Directory',
  toolCategory: 'Directory',
} as const;

/** Adobe `product` field for directory download and similar events */
export const TRAVEL_INSURANCE_DIRECTORY_ANALYTICS_PRODUCT_NAME =
  TOOL_BASE.toolName;

export function buildPageAnalyticsData(
  variant: TravelInsuranceDirectoryAnalyticsVariant,
): AnalyticsData {
  const pageBase = {
    categoryLevels: [...CATEGORY_LEVELS],
    pageType: 'tool page',
    site: 'moneyhelper',
  };

  switch (variant) {
    case 'landing':
      return {
        page: {
          ...pageBase,
          pageName: 'travel-insurance-directory--landing',
          pageTitle: 'Travel Insurance Directory -- Landing Page',
        },
        tool: {
          ...TOOL_BASE,
          toolStep: '1',
          stepName: 'Travel Insurance Directory -- Landing Page',
        },
      };
    case 'viewFirms':
      return {
        page: {
          ...pageBase,
          pageName: 'travel-insurance-directory--View-Firms',
          pageTitle: 'Travel Insurance Directory -- View-Firms Page',
        },
        tool: {
          ...TOOL_BASE,
          toolStep: '2',
          stepName: 'Travel Insurance Directory -- View-Firms',
        },
      };
    case 'firmListings':
      return {
        page: {
          ...pageBase,
          pageName: 'travel-insurance-directory--firm-listings',
          pageTitle: 'Travel Insurance Directory -- Firms-Listings Page',
        },
        tool: {
          ...TOOL_BASE,
          toolStep: '3',
          stepName: 'Travel Insurance Directory -- Firms-Listings Page',
        },
      };
    default: {
      throw new Error(`Unexpected variant: ${variant}`);
    }
  }
}
