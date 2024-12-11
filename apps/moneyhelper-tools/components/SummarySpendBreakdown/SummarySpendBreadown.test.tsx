import { render } from '@testing-library/react';

import { SummarySpendBreakdown } from './SummarySpendBreakdown';
import data from './summarySpendData.json';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('SummarySpendBreakdown component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <SummarySpendBreakdown data={data} heading="Spending Breakdown" />,
    );
    expect(container).toMatchSnapshot();
  });
  it('renders correctly with tick', () => {
    const { container } = render(
      <SummarySpendBreakdown
        data={[
          {
            name: 'Family & Friends',
            value: 100,
            hasTick: true,
            percentage: 10,
            colour: '#879a24',
            url: '/cost-tab',
          },
        ]}
        heading="Spending Breakdown"
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('renders correctly as estimate', () => {
    const { container } = render(
      <SummarySpendBreakdown
        data={[
          {
            name: 'Travel',
            value: 100,
            isEstimate: true,
            percentage: 2.5,
            colour: '#000d3d',
            url: '/cost-tab',
          },
        ]}
        heading="Spending Breakdown"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
