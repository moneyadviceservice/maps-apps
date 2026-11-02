import { generateAnalyticsData } from './generateAnalyticsData';

describe('generateAnalyticsData', () => {
  const baseProps = {
    heading: 'Your Details',
    category: 'Register',
    toolStep: '1',
    stepName: 'step1',
  };

  it('returns the correct structure with default values', () => {
    const result = generateAnalyticsData(baseProps);

    // Test Page Data
    expect(result.page?.pageName).toBe(
      'travel-insurance-directory--register-step1',
    );
    expect(result.page?.pageTitle).toBe(
      'Register - Your Details -- Travel Insurance Directory',
    );
    expect(result.page?.categoryLevels).toEqual([
      'Everyday Money',
      'Insurance',
    ]);
    expect(result.page?.site).toBe('moneyhelper');

    // Test Tool Data
    expect(result.tool?.toolName).toBe('Travel Insurance Directory: Register');
    expect(result.tool?.toolStep).toBe('1');
    expect(result.tool?.stepName).toBe('Your Details');
  });

  it('correctly includes registerStep in pageName and toolName when provided', () => {
    const result = generateAnalyticsData({
      ...baseProps,
      currentFlow: 'firm',
    });

    // Should include 'firm' in the slug and the title
    expect(result.page?.pageName).toBe(
      'travel-insurance-directory--register-firm-step1',
    );
    expect(result.tool?.toolName).toBe(
      'Travel Insurance Directory: Register - firm',
    );
  });

  it('allows overriding default categoryLevels and toolName', () => {
    const result = generateAnalyticsData({
      ...baseProps,
      toolName: 'Custom Tool',
      categoryLevels: ['Level 1'],
    });

    expect(result.page?.pageName).toContain('custom-tool');
    expect(result.page?.categoryLevels).toEqual(['Level 1']);
  });

  it('handles spaces and casing in pageName correctly', () => {
    const result = generateAnalyticsData({
      ...baseProps,
      category: 'My Category',
      stepName: 'Step One',
    });

    // Check lowercase and hyphen replacement
    expect(result.page?.pageName).toBe(
      'travel-insurance-directory--my-category-step-one',
    );
  });
});
