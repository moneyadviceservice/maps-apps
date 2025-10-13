import { render } from '@testing-library/react';

import { SUMMARY_TOTAL_STATUS_TYPES, SummaryTotal } from './SummaryTotal';

const mockParams = {
  title: 'Summary total',
  income: 4000,
  spending: 3000,
  balance: 1000,
  incomeLabel: 'Income',
  spendingLabel: 'Spending',
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
});
