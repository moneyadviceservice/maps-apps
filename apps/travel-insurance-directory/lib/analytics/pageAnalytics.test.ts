import {
  buildPageAnalyticsData,
  type TravelInsuranceDirectoryAnalyticsVariant,
} from './pageAnalytics';

describe('buildPageAnalyticsData', () => {
  const variants: TravelInsuranceDirectoryAnalyticsVariant[] = [
    'landing',
    'viewFirms',
    'firmListings',
  ];

  it.each(variants)('includes pageLoadReact event shape for %s', (variant) => {
    const data = buildPageAnalyticsData(variant);
    expect(data.page?.categoryLevels).toEqual(['Everyday Money', 'Insurance']);
    expect(data.page?.pageType).toBe('tool page');
    expect(data.page?.site).toBe('moneyhelper');
    expect(data.tool?.toolName).toBe('Travel Insurance Directory');
    expect(data.tool?.toolCategory).toBe('Directory');
  });

  it('returns landing step 1 payload', () => {
    const data = buildPageAnalyticsData('landing');
    expect(data.page?.pageName).toBe('travel-insurance-directory--landing');
    expect(data.page?.pageTitle).toBe(
      'Travel Insurance Directory -- Landing Page',
    );
    expect(data.tool?.toolStep).toBe('1');
    expect(data.tool?.stepName).toBe(
      'Travel Insurance Directory -- Landing Page',
    );
  });

  it('returns view-firms step 2 payload with preserved pageName casing', () => {
    const data = buildPageAnalyticsData('viewFirms');
    expect(data.page?.pageName).toBe('travel-insurance-directory--View-Firms');
    expect(data.page?.pageTitle).toBe(
      'Travel Insurance Directory -- View-Firms Page',
    );
    expect(data.tool?.toolStep).toBe('2');
    expect(data.tool?.stepName).toBe(
      'Travel Insurance Directory -- View-Firms',
    );
  });

  it('returns firm listings step 3 payload', () => {
    const data = buildPageAnalyticsData('firmListings');
    expect(data.page?.pageName).toBe(
      'travel-insurance-directory--firm-listings',
    );
    expect(data.page?.pageTitle).toBe(
      'Travel Insurance Directory -- Firms-Listings Page',
    );
    expect(data.tool?.toolStep).toBe('3');
    expect(data.tool?.stepName).toBe(
      'Travel Insurance Directory -- Firms-Listings Page',
    );
  });
});
