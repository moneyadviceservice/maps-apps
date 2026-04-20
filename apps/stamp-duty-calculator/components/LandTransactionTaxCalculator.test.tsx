import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LandTransactionTaxCalculator } from './LandTransactionTaxCalculator';
import { AnalyticsData } from '@maps-react/hooks/useAnalytics';

// Mock the BaseCalculator component using the shared mock
jest.mock('./BaseCalculator', () => {
  // Import the helper inside the mock factory to avoid scope issues
  const { createMockBaseCalculator } = require('../utils/testHelpers');
  return {
    BaseCalculator: createMockBaseCalculator(),
  };
});

// Mock the config
jest.mock('../data/ltt/landTransactionTaxConfig', () => {
  const { createMockTaxConfig } = require('../utils/testHelpers');
  return {
    landTransactionTaxConfig: createMockTaxConfig({
      name: 'LTT Calculator',
      title: 'Land Transaction Tax Calculator',
      analyticsToolName: 'LTT Calculator',
    }),
    LandTransactionTaxInput: {},
  };
});

describe('LandTransactionTaxCalculator', () => {
  const defaultProps = {
    propertyPrice: '',
    buyerType: 'firstOrNextHome' as const,
    calculated: false,
    analyticsData: { event: 'toolStart' } as AnalyticsData,
    isEmbedded: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render BaseCalculator with correct props', () => {
    render(<LandTransactionTaxCalculator {...defaultProps} />);

    expect(screen.getByTestId('base-calculator')).toBeInTheDocument();
    expect(screen.getByTestId('config-name')).toHaveTextContent(
      'LTT Calculator',
    );
  });

  it('should pass initial values correctly when both propertyPrice and buyerType are provided', () => {
    render(
      <LandTransactionTaxCalculator
        {...defaultProps}
        propertyPrice="350000"
        buyerType="additionalHome"
      />,
    );

    expect(screen.getByTestId('initial-buyerType')).toHaveTextContent(
      'additionalHome',
    );
    expect(screen.getByTestId('initial-price')).toHaveTextContent('350000');
  });

  it('should pass empty strings as initial values when props are empty', () => {
    render(
      <LandTransactionTaxCalculator
        {...defaultProps}
        propertyPrice=""
        buyerType={'' as any}
      />,
    );

    expect(screen.getByTestId('initial-buyerType')).toHaveTextContent('');
    expect(screen.getByTestId('initial-price')).toHaveTextContent('');
  });

  it('should handle all buyer types correctly', () => {
    const buyerTypes: Array<'firstOrNextHome' | 'additionalHome'> = [
      'firstOrNextHome',
      'additionalHome',
    ];

    buyerTypes.forEach((buyerType) => {
      const { unmount } = render(
        <LandTransactionTaxCalculator
          {...defaultProps}
          buyerType={buyerType}
        />,
      );

      expect(screen.getByTestId('initial-buyerType')).toHaveTextContent(
        buyerType,
      );

      unmount();
    });
  });

  it('should pass calculated prop correctly', () => {
    const { rerender } = render(
      <LandTransactionTaxCalculator {...defaultProps} calculated={false} />,
    );

    expect(screen.getByTestId('calculated')).toHaveTextContent('false');

    rerender(
      <LandTransactionTaxCalculator {...defaultProps} calculated={true} />,
    );

    expect(screen.getByTestId('calculated')).toHaveTextContent('true');
  });

  it('should pass analyticsData correctly', () => {
    const analyticsData: AnalyticsData = {
      event: 'toolCompletion',
      eventInfo: {
        toolName: 'LTT Calculator',
        toolStep: 2,
        stepName: 'Results',
      },
    };

    render(
      <LandTransactionTaxCalculator
        {...defaultProps}
        analyticsData={analyticsData}
      />,
    );

    expect(screen.getByTestId('analytics-event')).toHaveTextContent(
      'toolCompletion',
    );
  });

  it('should pass isEmbedded prop correctly', () => {
    const { rerender } = render(
      <LandTransactionTaxCalculator {...defaultProps} isEmbedded={false} />,
    );

    expect(screen.getByTestId('isEmbedded')).toHaveTextContent('false');

    rerender(
      <LandTransactionTaxCalculator {...defaultProps} isEmbedded={true} />,
    );

    expect(screen.getByTestId('isEmbedded')).toHaveTextContent('true');
  });

  it('should handle undefined analyticsData', () => {
    render(
      <LandTransactionTaxCalculator
        {...defaultProps}
        analyticsData={undefined as any}
      />,
    );

    expect(screen.getByTestId('analytics-event')).toHaveTextContent('none');
  });

  it('should handle various property price formats', () => {
    const prices = ['150000', '2500.75', '0', ''];

    prices.forEach((price) => {
      const { unmount } = render(
        <LandTransactionTaxCalculator
          {...defaultProps}
          propertyPrice={price}
        />,
      );

      expect(screen.getByTestId('initial-price')).toHaveTextContent(price);

      unmount();
    });
  });

  it('should maintain correct prop types', () => {
    // This test ensures TypeScript types are correctly enforced
    const validProps = {
      propertyPrice: '450000',
      buyerType: 'firstOrNextHome' as const,
      calculated: true,
      analyticsData: { event: 'toolStart' } as AnalyticsData,
      isEmbedded: true,
    };

    render(<LandTransactionTaxCalculator {...validProps} />);

    expect(screen.getByTestId('base-calculator')).toBeInTheDocument();
  });

  it('should handle edge case with all props at once', () => {
    const complexProps = {
      propertyPrice: '1234567.89',
      buyerType: 'additionalHome' as const,
      calculated: true,
      analyticsData: {
        event: 'errorMessage',
        eventInfo: {
          toolName: 'LTT Calculator',
          toolStep: 1,
          stepName: 'Calculate',
          errorDetails: [
            {
              reactCompType: 'MoneyInput',
              reactCompName: 'price',
              errorMessage: 'Test error',
            },
          ],
        },
      } as AnalyticsData,
      isEmbedded: true,
    };

    render(<LandTransactionTaxCalculator {...complexProps} />);

    expect(screen.getByTestId('initial-buyerType')).toHaveTextContent(
      'additionalHome',
    );
    expect(screen.getByTestId('initial-price')).toHaveTextContent('1234567.89');
    expect(screen.getByTestId('calculated')).toHaveTextContent('true');
    expect(screen.getByTestId('isEmbedded')).toHaveTextContent('true');
    expect(screen.getByTestId('analytics-event')).toHaveTextContent(
      'errorMessage',
    );
  });

  it('should correctly handle falsy values for buyerType and propertyPrice', () => {
    // Test with null/undefined-like values (as empty strings)
    render(
      <LandTransactionTaxCalculator
        {...defaultProps}
        propertyPrice=""
        buyerType={'' as any}
      />,
    );

    // Both should default to empty string due to || '' in initialValues
    expect(screen.getByTestId('initial-buyerType')).toHaveTextContent('');
    expect(screen.getByTestId('initial-price')).toHaveTextContent('');
  });

  it('should verify BaseCalculator receives landTransactionTaxConfig', () => {
    const { BaseCalculator } = jest.requireMock('./BaseCalculator');

    render(<LandTransactionTaxCalculator {...defaultProps} />);

    expect(BaseCalculator).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          name: 'LTT Calculator',
          title: 'Land Transaction Tax Calculator',
          analyticsToolName: 'LTT Calculator',
        }),
      }),
      expect.anything(),
    );
  });

  it('should handle the specific buyer types for Land Transaction Tax', () => {
    // LTT has different buyer type values than SDLT
    const { unmount: unmount1 } = render(
      <LandTransactionTaxCalculator
        {...defaultProps}
        buyerType="firstOrNextHome"
      />,
    );

    expect(screen.getByTestId('initial-buyerType')).toHaveTextContent(
      'firstOrNextHome',
    );

    unmount1();

    const { unmount: unmount2 } = render(
      <LandTransactionTaxCalculator
        {...defaultProps}
        buyerType="additionalHome"
      />,
    );

    expect(screen.getByTestId('initial-buyerType')).toHaveTextContent(
      'additionalHome',
    );

    unmount2();
  });

  it('should create initial values object with correct structure', () => {
    const { BaseCalculator } = jest.requireMock('./BaseCalculator');

    render(
      <LandTransactionTaxCalculator
        {...defaultProps}
        propertyPrice="275000"
        buyerType="firstOrNextHome"
      />,
    );

    expect(BaseCalculator).toHaveBeenCalledWith(
      expect.objectContaining({
        initialValues: {
          buyerType: 'firstOrNextHome',
          price: '275000',
          purchaseDate: '',
        },
      }),
      expect.anything(),
    );
  });
});
