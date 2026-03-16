import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { SUMMARY_TOTAL_STATUS_TYPES, SummaryTotal } from './SummaryTotal';

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
        onSelectClick={(e) => {
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
});
