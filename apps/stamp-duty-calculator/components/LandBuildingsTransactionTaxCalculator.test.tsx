import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LandBuildingsTransactionTaxCalculator } from './LandBuildingsTransactionTaxCalculator';
import { AnalyticsData } from '@maps-react/hooks/useAnalytics';

// Mock BaseCalculator with test ids to assert props
jest.mock('./BaseCalculator', () => {
  const { createMockBaseCalculator } = require('../utils/testHelpers');
  return {
    BaseCalculator: createMockBaseCalculator(),
  };
});

// Mock the config
jest.mock('../data/lbtt/landBuildingsTransactionTaxConfig', () => {
  const { createMockTaxConfig } = require('../utils/testHelpers');
  return {
    landBuildingsTransactionTaxConfig: createMockTaxConfig({
      name: 'LBTT Calculator',
      title: 'Land and Buildings Transaction Tax Calculator',
      analyticsToolName: 'LBTT Calculator',
    }),
    LandTransactionTaxInput: {},
  };
});

describe('LandBuildingsTransactionTaxCalculator', () => {
  const defaultProps = {
    propertyPrice: '',
    buyerType: 'firstTimeBuyer' as const,
    calculated: false,
    analyticsData: { event: 'toolStart' } as AnalyticsData,
    isEmbedded: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders BaseCalculator with correct config', () => {
    render(<LandBuildingsTransactionTaxCalculator {...defaultProps} />);
    expect(screen.getByTestId('base-calculator')).toBeInTheDocument();
    expect(screen.getByTestId('config-name')).toHaveTextContent(
      'LBTT Calculator',
    );
  });

  it('passes initial values correctly', () => {
    render(
      <LandBuildingsTransactionTaxCalculator
        {...defaultProps}
        propertyPrice="500000"
        buyerType="additionalHome"
      />,
    );

    expect(screen.getByTestId('initial-buyerType')).toHaveTextContent(
      'additionalHome',
    );
    expect(screen.getByTestId('initial-price')).toHaveTextContent('500000');
  });

  it('defaults to empty string for missing buyerType or price', () => {
    render(
      <LandBuildingsTransactionTaxCalculator
        {...defaultProps}
        buyerType={'' as any}
        propertyPrice=""
      />,
    );

    expect(screen.getByTestId('initial-buyerType')).toHaveTextContent('');
    expect(screen.getByTestId('initial-price')).toHaveTextContent('');
  });

  it('correctly handles all buyerType values', () => {
    const buyerTypes: Array<'firstTimeBuyer' | 'nextHome' | 'additionalHome'> =
      ['firstTimeBuyer', 'nextHome', 'additionalHome'];

    buyerTypes.forEach((type) => {
      const { unmount } = render(
        <LandBuildingsTransactionTaxCalculator
          {...defaultProps}
          buyerType={type}
        />,
      );
      expect(screen.getByTestId('initial-buyerType')).toHaveTextContent(type);
      unmount();
    });
  });

  it('passes calculated flag', () => {
    const { rerender } = render(
      <LandBuildingsTransactionTaxCalculator
        {...defaultProps}
        calculated={false}
      />,
    );
    expect(screen.getByTestId('calculated')).toHaveTextContent('false');

    rerender(
      <LandBuildingsTransactionTaxCalculator
        {...defaultProps}
        calculated={true}
      />,
    );
    expect(screen.getByTestId('calculated')).toHaveTextContent('true');
  });

  it('handles analyticsData correctly', () => {
    const analyticsData: AnalyticsData = {
      event: 'toolCompletion',
      eventInfo: {
        toolName: 'LBTT Calculator',
        toolStep: 3,
        stepName: 'Results',
      },
    };

    render(
      <LandBuildingsTransactionTaxCalculator
        {...defaultProps}
        analyticsData={analyticsData}
      />,
    );

    expect(screen.getByTestId('analytics-event')).toHaveTextContent(
      'toolCompletion',
    );
  });

  it('handles undefined analyticsData gracefully', () => {
    render(
      <LandBuildingsTransactionTaxCalculator
        {...defaultProps}
        analyticsData={undefined as any}
      />,
    );
    expect(screen.getByTestId('analytics-event')).toHaveTextContent('none');
  });

  it('respects isEmbedded prop', () => {
    const { rerender } = render(
      <LandBuildingsTransactionTaxCalculator
        {...defaultProps}
        isEmbedded={false}
      />,
    );
    expect(screen.getByTestId('isEmbedded')).toHaveTextContent('false');

    rerender(
      <LandBuildingsTransactionTaxCalculator
        {...defaultProps}
        isEmbedded={true}
      />,
    );
    expect(screen.getByTestId('isEmbedded')).toHaveTextContent('true');
  });

  it('correctly formats various property prices', () => {
    const prices = ['50000', '100000.99', '0', ''];

    prices.forEach((price) => {
      const { unmount } = render(
        <LandBuildingsTransactionTaxCalculator
          {...defaultProps}
          propertyPrice={price}
        />,
      );

      expect(screen.getByTestId('initial-price')).toHaveTextContent(price);
      unmount();
    });
  });

  it('correctly passes all props in a complex case', () => {
    const complexProps = {
      propertyPrice: '875000',
      buyerType: 'nextHome' as const,
      calculated: true,
      analyticsData: {
        event: 'errorMessage',
        eventInfo: {
          toolName: 'LBTT Calculator',
          toolStep: 2,
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

    render(<LandBuildingsTransactionTaxCalculator {...complexProps} />);
    expect(screen.getByTestId('initial-buyerType')).toHaveTextContent(
      'nextHome',
    );
    expect(screen.getByTestId('initial-price')).toHaveTextContent('875000');
    expect(screen.getByTestId('calculated')).toHaveTextContent('true');
    expect(screen.getByTestId('isEmbedded')).toHaveTextContent('true');
    expect(screen.getByTestId('analytics-event')).toHaveTextContent(
      'errorMessage',
    );
  });

  it('falls back to empty string when buyerType or price is undefined', () => {
    render(
      <LandBuildingsTransactionTaxCalculator
        {...defaultProps}
        buyerType={undefined as any}
        propertyPrice={undefined as any}
      />,
    );
    expect(screen.getByTestId('initial-buyerType')).toHaveTextContent('');
    expect(screen.getByTestId('initial-price')).toHaveTextContent('');
  });
});
