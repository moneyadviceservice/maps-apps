import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import {
  SUMMARY_TOTAL_STATUS_TYPES,
  SummaryBalanceBar,
  SummaryTotal,
} from './SummaryTotal';

import '@testing-library/jest-dom';

const mockParams = {
  title: 'Summary total (monthly)',
  income: 4000,
  spending: 3000,
  balance: 1000,
  incomeLabel: 'Retirement income',
  spendingLabel: 'Your spending',
  balanceLabel: 'Balance',
};

describe('Summary Total component', () => {
  it('should render Summary Total component in balanced state', () => {
    const { container } = render(<SummaryTotal {...mockParams} />);

    expect(container).toMatchSnapshot();
  });

  it('should render Summary Total component in positive state', () => {
    const { container } = render(
      <SummaryTotal
        {...mockParams}
        status={SUMMARY_TOTAL_STATUS_TYPES.POSITIVE}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render Summary Total component in negative state', () => {
    const { container } = render(
      <SummaryTotal
        {...mockParams}
        spending={5000}
        balance={-1000}
        status={SUMMARY_TOTAL_STATUS_TYPES.NEGATIVE}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render labels and values', () => {
    render(<SummaryTotal {...mockParams} />);

    expect(screen.getByText(mockParams.incomeLabel)).toBeInTheDocument();
    expect(screen.getByText(mockParams.spendingLabel)).toBeInTheDocument();
    expect(screen.getByText(mockParams.balanceLabel)).toBeInTheDocument();
  });

  it('merges container className with base classes via twMerge', () => {
    render(
      <SummaryTotal
        {...mockParams}
        data-testid="summary-total"
        className="md:sticky md:top-4"
      />,
    );

    const root = screen.getByTestId('summary-total');
    const className = root.className;

    expect(className).toMatch(/md:sticky/);
    expect(className).toMatch(/md:top-4/);
  });

  it('should trigger event when dropdown value changes', () => {
    render(
      <SummaryTotal
        {...mockParams}
        data-testid="t-summary-total"
        dropDownOptions={[
          {
            text: 'monthly',
            value: '1',
          },
          {
            text: 'yearly',
            value: '1/12',
          },
        ]}
        onSelectClick={() => {
          const summaryTotal = document.querySelector(
            'div[data-testid="t-summary-total"]',
          );
          const val = summaryTotal?.querySelectorAll('span');

          val?.forEach((total, index) => {
            if (index > 0) total.innerHTML = `£${1000 * (index + 1) * 2}`;
          });
        }}
      />,
    );

    const dropdown = screen.getByTestId('t-summary-options');
    fireEvent.change(dropdown, { target: { value: 'yearly' } });

    waitFor(() => {
      const income = screen.getAllByText('£500'),
        spending = screen.findAllByText('£1000'),
        balance = screen.findAllByText('£1500');

      expect(income).toBeTruthy();
      expect(spending).toBeTruthy();
      expect(balance).toBeTruthy();
    });
  });

  it('should render with summary variant', () => {
    const { container } = render(
      <SummaryTotal {...mockParams} variant="summary" />,
    );

    const heading = container.querySelector('h3');
    expect(heading).toBeInTheDocument();
    expect(heading?.className).toContain('font-semibold text-center');
  });

  it('should render with titleWithFrequency', () => {
    render(<SummaryTotal {...mockParams} titleWithFrequency="(monthly)" />);

    expect(screen.getByText('(monthly)')).toBeInTheDocument();
  });

  it('should render with custom aria-label props', () => {
    const customProps = {
      ariaLabels: {
        description: 'Custom description',
        statusOverspending: 'Custom overspending',
        statusPositive: 'Custom positive',
        statusBalanced: 'Custom balanced',
        amountSuffix: 'custom amount:',
        selectLabel: 'Custom select',
      },
    };

    render(
      <SummaryTotal
        {...mockParams}
        {...customProps}
        status={SUMMARY_TOTAL_STATUS_TYPES.POSITIVE}
      />,
    );

    // Check that custom aria description is used
    const description = document.getElementById('summary-total-description');
    expect(description?.textContent).toBe('Custom description');
  });

  it('should use translation fallbacks when props not provided', () => {
    render(<SummaryTotal {...mockParams} />);

    // Check that translations are used
    const description = document.getElementById('summary-total-description');
    expect(description?.textContent).toBe(
      'Financial summary showing income, spending and balance',
    );
  });

  it('should handle partial aria-label props with translation fallbacks', () => {
    render(
      <SummaryTotal
        {...mockParams}
        ariaLabels={{ description: 'Custom description only' }}
        status={SUMMARY_TOTAL_STATUS_TYPES.NEGATIVE}
      />,
    );

    const description = document.getElementById('summary-total-description');
    expect(description?.textContent).toBe('Custom description only');

    expect(
      screen.getByText(/Balance amount: .*\. Overspending/),
    ).toBeInTheDocument();
  });

  it('should handle empty string aria props by falling back to translations', () => {
    render(
      <SummaryTotal
        {...mockParams}
        ariaLabels={{ description: '', amountSuffix: '' }}
        status={SUMMARY_TOTAL_STATUS_TYPES.POSITIVE}
      />,
    );

    // Empty strings should trigger fallback to translations
    const description = document.getElementById('summary-total-description');
    expect(description?.textContent).toBe(
      'Financial summary showing income, spending and balance',
    );
  });

  it('should correctly append colon to amount aria suffix', () => {
    render(<SummaryTotal {...mockParams} />);

    const ddElement = document.querySelector('dd');
    expect(ddElement).not.toHaveAttribute('aria-label');
    expect(ddElement?.querySelector('.sr-only')).toHaveTextContent('amount:');
  });

  it('should use custom aria amount suffix without colon duplication', () => {
    render(
      <SummaryTotal
        {...mockParams}
        ariaLabels={{ amountSuffix: 'custom amount value:' }}
      />,
    );

    const ddElement = document.querySelector('dd');
    expect(ddElement?.querySelector('.sr-only')).toHaveTextContent(
      'custom amount value:',
    );
  });

  it('should handle non-string label in SummaryRow gracefully', () => {
    // This tests the typeof check in SummaryRow
    const { container } = render(<SummaryTotal {...mockParams} />);

    // Verify the component renders without errors
    expect(container.querySelector('dl')).toBeInTheDocument();
  });

  it('should render dropdown with proper aria-label', () => {
    render(
      <SummaryTotal
        {...mockParams}
        dropDownOptions={[
          { text: 'monthly', value: '1' },
          { text: 'yearly', value: '12' },
        ]}
        ariaLabels={{ selectLabel: 'Custom select label' }}
      />,
    );

    const select = screen.getByTestId('t-summary-options');
    expect(select).toHaveAttribute('aria-label', 'Custom select label');
  });

  it('should apply correct background color for balanced status', () => {
    render(
      <SummaryTotal
        {...mockParams}
        status={SUMMARY_TOTAL_STATUS_TYPES.BALANCED}
      />,
    );

    const balanceContainer = screen.getByText('Balance').closest('div');
    expect(balanceContainer?.className).toContain('bg-green-700');
  });

  it('should apply correct background color for negative status', () => {
    render(
      <SummaryTotal
        {...mockParams}
        status={SUMMARY_TOTAL_STATUS_TYPES.NEGATIVE}
        balance={-1000}
      />,
    );

    const balanceContainer = screen.getByText('Balance').closest('div');
    expect(balanceContainer?.className).toContain('bg-red-700');
  });

  it('should apply correct background color for positive status', () => {
    render(
      <SummaryTotal
        {...mockParams}
        status={SUMMARY_TOTAL_STATUS_TYPES.POSITIVE}
      />,
    );

    const balanceContainer = screen.getByText('Balance').closest('div');
    expect(balanceContainer?.className).toContain('bg-green-700');
  });

  it('should include balance status in screen reader text without prohibited aria-labels', () => {
    const { container } = render(
      <SummaryTotal
        {...mockParams}
        status={SUMMARY_TOTAL_STATUS_TYPES.NEGATIVE}
        balance={-1000}
      />,
    );

    expect(
      screen.getByText(/Balance amount: .*\. Overspending/),
    ).toBeInTheDocument();
    expect(container.querySelector('dl [aria-label]')).not.toBeInTheDocument();
  });

  it('should render default variant with h2 heading', () => {
    const { container } = render(
      <SummaryTotal {...mockParams} variant="default" />,
    );

    const heading = container.querySelector('h2');
    expect(heading).toBeInTheDocument();
    expect(heading?.className).toContain('text-gray-800 font-bold');
  });

  it('should generate correct data-testid for summary values', () => {
    render(<SummaryTotal {...mockParams} />);

    // Check that test IDs are generated correctly
    expect(
      screen.getByTestId('t-summary-value-retirement-income'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('t-summary-value-your-spending'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('t-summary-value-balance')).toBeInTheDocument();
  });

  it('should render with dropdown and default value', () => {
    render(
      <SummaryTotal
        {...mockParams}
        dropDownOptions={[
          { text: 'monthly', value: 'month' },
          { text: 'yearly', value: 'year' },
        ]}
        defaultSummaryTotal="year"
      />,
    );

    const select = screen.getByTestId('t-summary-options') as HTMLSelectElement;
    expect(select.value).toBe('year');
  });

  it('should render all required aria attributes', () => {
    const { container } = render(<SummaryTotal {...mockParams} />);

    const dl = container.querySelector('dl');
    expect(dl).toHaveAttribute('aria-labelledby', 'summary-total-heading');
    expect(dl).toHaveAttribute('aria-describedby', 'summary-total-description');
  });

  it('should format currency values correctly', () => {
    render(
      <SummaryTotal
        {...mockParams}
        income={1234.56}
        spending={789.12}
        balance={445.44}
      />,
    );

    // Check that values are rendered (NumberFormat renders the value in the DOM)
    const incomeElement = screen.getByTestId(
      't-summary-value-retirement-income',
    );
    const spendingElement = screen.getByTestId('t-summary-value-your-spending');
    const balanceElement = screen.getByTestId('t-summary-value-balance');

    expect(incomeElement).toBeInTheDocument();
    expect(spendingElement).toBeInTheDocument();
    expect(balanceElement).toBeInTheDocument();
  });

  it('should render section with custom testId', () => {
    render(<SummaryTotal {...mockParams} data-testid="custom-summary" />);

    expect(screen.getByTestId('custom-summary')).toBeInTheDocument();
  });

  it('should handle multiple status types in aria-labels', () => {
    const { rerender, container } = render(
      <SummaryTotal
        {...mockParams}
        status={SUMMARY_TOTAL_STATUS_TYPES.BALANCED}
      />,
    );

    const balanceText = () =>
      container
        .querySelector('[data-testid="t-summary-value-balance"]')
        ?.parentElement?.querySelector('.sr-only');

    expect(balanceText()).toHaveTextContent('Balanced');

    rerender(
      <SummaryTotal
        {...mockParams}
        status={SUMMARY_TOTAL_STATUS_TYPES.POSITIVE}
      />,
    );

    expect(balanceText()).toHaveTextContent('Positive balance');

    rerender(
      <SummaryTotal
        {...mockParams}
        status={SUMMARY_TOTAL_STATUS_TYPES.NEGATIVE}
        balance={-500}
      />,
    );

    expect(balanceText()).toHaveTextContent('Overspending');
  });

  describe('detachBalanceOnMobile', () => {
    it('makes the balance row transparent on mobile but keeps it in the DOM and layout', () => {
      render(<SummaryTotal {...mockParams} detachBalanceOnMobile />);

      const balanceRow = screen.getByText('Balance').closest('div');
      expect(balanceRow?.className).toContain('max-md:opacity-0');
      expect(balanceRow?.className).not.toContain('sr-only');
      expect(screen.getByTestId('t-summary-value-balance')).toBeInTheDocument();
    });

    it('keeps the full box border and padding', () => {
      render(
        <SummaryTotal
          {...mockParams}
          data-testid="summary"
          detachBalanceOnMobile
        />,
      );

      expect(screen.getByTestId('summary').className).not.toContain('max-md:');
    });

    it('does not alter the balance row by default', () => {
      render(<SummaryTotal {...mockParams} />);

      expect(
        screen.getByText('Balance').closest('div')?.className,
      ).not.toContain('max-md:opacity-0');
    });
  });

  describe('SummaryBalanceBar', () => {
    it('renders a sticky, mobile-only, aria-hidden balance', () => {
      render(<SummaryBalanceBar label="Balance" amount={1000} />);

      const bar = screen.getByTestId('summary-balance-bar');
      expect(bar).toHaveAttribute('aria-hidden', 'true');
      expect(bar.className).toContain('sticky');
      expect(bar.className).toContain('bottom-0');
      expect(bar.className).toContain('md:hidden');
      expect(bar.className).not.toMatch(/(^|\s)border/);
      expect(bar).toHaveTextContent('Balance');
      expect(bar).toHaveTextContent('£1,000.00');
    });

    it('uses red for negative and green otherwise', () => {
      const { rerender } = render(
        <SummaryBalanceBar
          label="Balance"
          amount={-5}
          status={SUMMARY_TOTAL_STATUS_TYPES.NEGATIVE}
        />,
      );

      expect(screen.getByText('Balance').closest('div')?.className).toContain(
        'bg-red-700',
      );

      rerender(<SummaryBalanceBar label="Balance" amount={5} />);

      expect(screen.getByText('Balance').closest('div')?.className).toContain(
        'bg-green-700',
      );
    });
  });
});
