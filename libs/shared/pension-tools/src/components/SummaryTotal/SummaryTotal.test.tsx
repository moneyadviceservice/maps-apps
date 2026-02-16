import { render, screen } from '@testing-library/react';

import { SUMMARY_TOTAL_STATUS_TYPES, SummaryTotal } from './SummaryTotal';

import '@testing-library/jest-dom';

const mockParams = {
  title: 'Joint summary total (monthly)',
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
});
