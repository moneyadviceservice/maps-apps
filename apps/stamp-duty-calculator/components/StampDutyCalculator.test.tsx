import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StampDutyCalculator } from './StampDutyCalculator';
import { AnalyticsData } from '@maps-react/hooks/useAnalytics';

// Mock the BaseCalculator component
jest.mock('./BaseCalculator', () => {
  // Import the helper inside the mock factory to avoid scope issues
  const { createMockBaseCalculator } = require('../utils/testHelpers');
  return {
    BaseCalculator: createMockBaseCalculator(),
  };
});

// Mock the config
jest.mock('../data/sdlt/stampDutyCalculatorConfig', () => {
  const { createMockTaxConfig } = require('../utils/testHelpers');
  return {
    stampDutyCalculatorConfig: createMockTaxConfig({
      name: 'SDLT Calculator',
      title: 'Stamp Duty Land Tax Calculator',
      analyticsToolName: 'SDLT Calculator',
    }),
    StampDutyInput: {},
  };
});

describe('StampDutyCalculator (New)', () => {
  const defaultProps = {
    propertyPrice: '',
    buyerType: 'firstTimeBuyer' as const,
    calculated: false,
    title: 'Test Title',
    analyticsData: { event: 'toolStart' } as AnalyticsData,
    isEmbedded: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render BaseCalculator with correct props', () => {
    render(<StampDutyCalculator {...defaultProps} />);

    expect(screen.getByTestId('base-calculator')).toBeInTheDocument();
    expect(screen.getByTestId('config-name')).toHaveTextContent(
      'SDLT Calculator',
    );
  });

  it('should pass initial values correctly when both propertyPrice and buyerType are provided', () => {
    render(
      <StampDutyCalculator
        {...defaultProps}
        propertyPrice="250000"
        buyerType="nextHome"
      />,
    );

    expect(screen.getByTestId('initial-buyerType')).toHaveTextContent(
      'nextHome',
    );
    expect(screen.getByTestId('initial-price')).toHaveTextContent('250000');
  });

  it('should pass empty strings as initial values when props are empty', () => {
    render(
      <StampDutyCalculator
        {...defaultProps}
        propertyPrice=""
        buyerType={'' as any}
      />,
    );

    expect(screen.getByTestId('initial-buyerType')).toHaveTextContent('');
    expect(screen.getByTestId('initial-price')).toHaveTextContent('');
  });

  it('should handle all buyer types correctly', () => {
    const buyerTypes: Array<'firstTimeBuyer' | 'nextHome' | 'additionalHome'> =
      ['firstTimeBuyer', 'nextHome', 'additionalHome'];

    buyerTypes.forEach((buyerType) => {
      const { unmount } = render(
        <StampDutyCalculator {...defaultProps} buyerType={buyerType} />,
      );

      expect(screen.getByTestId('initial-buyerType')).toHaveTextContent(
        buyerType,
      );

      unmount();
    });
  });

  it('should pass calculated prop correctly', () => {
    const { rerender } = render(
      <StampDutyCalculator {...defaultProps} calculated={false} />,
    );

    expect(screen.getByTestId('calculated')).toHaveTextContent('false');

    rerender(<StampDutyCalculator {...defaultProps} calculated={true} />);

    expect(screen.getByTestId('calculated')).toHaveTextContent('true');
  });

  it('should pass analyticsData correctly', () => {
    const analyticsData: AnalyticsData = {
      event: 'toolCompletion',
      eventInfo: {
        toolName: 'SDLT Calculator',
        toolStep: 2,
        stepName: 'Results',
      },
    };

    render(
      <StampDutyCalculator {...defaultProps} analyticsData={analyticsData} />,
    );

    expect(screen.getByTestId('analytics-event')).toHaveTextContent(
      'toolCompletion',
    );
  });

  it('should pass isEmbedded prop correctly', () => {
    const { rerender } = render(
      <StampDutyCalculator {...defaultProps} isEmbedded={false} />,
    );

    expect(screen.getByTestId('isEmbedded')).toHaveTextContent('false');

    rerender(<StampDutyCalculator {...defaultProps} isEmbedded={true} />);

    expect(screen.getByTestId('isEmbedded')).toHaveTextContent('true');
  });

  it('should handle undefined analyticsData', () => {
    render(
      <StampDutyCalculator
        {...defaultProps}
        analyticsData={undefined as any}
      />,
    );

    expect(screen.getByTestId('analytics-event')).toHaveTextContent('none');
  });

  it('should handle various property price formats', () => {
    const prices = ['100000', '1000.50', '0', ''];

    prices.forEach((price) => {
      const { unmount } = render(
        <StampDutyCalculator {...defaultProps} propertyPrice={price} />,
      );

      expect(screen.getByTestId('initial-price')).toHaveTextContent(price);

      unmount();
    });
  });

  it('should maintain correct prop types', () => {
    // This test ensures TypeScript types are correctly enforced
    const validProps = {
      propertyPrice: '300000',
      buyerType: 'firstTimeBuyer' as const,
      calculated: true,
      title: 'Stamp Duty Calculator',
      analyticsData: { event: 'toolStart' } as AnalyticsData,
      isEmbedded: true,
    };

    render(<StampDutyCalculator {...validProps} />);

    expect(screen.getByTestId('base-calculator')).toBeInTheDocument();
  });

  it('should handle edge case with all props at once', () => {
    const complexProps = {
      propertyPrice: '999999.99',
      buyerType: 'additionalHome' as const,
      calculated: true,
      title: 'Complex Test Title',
      analyticsData: {
        event: 'errorMessage',
        eventInfo: {
          toolName: 'SDLT Calculator',
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

    render(<StampDutyCalculator {...complexProps} />);

    expect(screen.getByTestId('initial-buyerType')).toHaveTextContent(
      'additionalHome',
    );
    expect(screen.getByTestId('initial-price')).toHaveTextContent('999999.99');
    expect(screen.getByTestId('calculated')).toHaveTextContent('true');
    expect(screen.getByTestId('isEmbedded')).toHaveTextContent('true');
    expect(screen.getByTestId('analytics-event')).toHaveTextContent(
      'errorMessage',
    );
  });

  it('should correctly handle falsy values for buyerType and propertyPrice', () => {
    // Test with null/undefined-like values (as empty strings)
    render(
      <StampDutyCalculator
        {...defaultProps}
        propertyPrice=""
        buyerType={'' as any}
      />,
    );

    // Both should default to empty string due to || '' in initialValues
    expect(screen.getByTestId('initial-buyerType')).toHaveTextContent('');
    expect(screen.getByTestId('initial-price')).toHaveTextContent('');
  });

  it('should verify BaseCalculator receives stampDutyCalculatorConfig', () => {
    const { BaseCalculator } = jest.requireMock('./BaseCalculator');

    render(<StampDutyCalculator {...defaultProps} />);

    expect(BaseCalculator).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          name: 'SDLT Calculator',
          title: 'Stamp Duty Land Tax Calculator',
          analyticsToolName: 'SDLT Calculator',
        }),
      }),
      expect.anything(),
    );
  });
});
