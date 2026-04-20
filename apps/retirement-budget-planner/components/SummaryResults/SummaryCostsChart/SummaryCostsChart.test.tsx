import { render, screen } from '@testing-library/react';
import { getSummaryResultsCostsChartColourFromIndex } from 'data/summaryResultsData';
import { SummaryCostsChart } from './SummaryCostsChart';
import { mockTranslationDataEn } from 'lib/mocks/mockUseTranslations';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: {
      language: 'en',
    },
  }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => {
  return {
    __esModule: true,
    default: () => ({
      t: (key: string) => mockTranslationDataEn[key] ?? key,
      locale: 'en',
    }),
  };
});

const renderComponent = () =>
  render(
    <SummaryCostsChart
      title="Retirement costs mock"
      items={[
        { name: 'housingCost', value: 100 },
        { name: 'utilities', value: 200 },
        { name: 'travelCosts', value: 300 },
        { name: 'lending', value: 400 },
        { name: 'insurance', value: 500 },
        { name: 'householdExpenses', value: 678.9 },
        { name: 'essentialsAdditionalItems', value: 7890.12 },
        { name: 'Mock dynamic category', value: 0 },
      ]}
      summaryData={{
        income: 5000,
        spending: 2800,
      }}
    />,
  );

describe('test SummaryCostsChart component', () => {
  it('should render component correctly', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();

    // Chart label
    expect(
      screen.getByRole('heading', {
        name: /retirement costs mock/i,
      }),
    ).toBeInTheDocument();
  });

  it('should render category names and values in the correct order', () => {
    renderComponent();

    const listTermItems = screen.getAllByRole('term');
    const listDefinitionItems = screen.getAllByRole('definition');

    expect(listTermItems).toHaveLength(8);
    expect(listDefinitionItems).toHaveLength(8);

    // Known category names
    expect(listTermItems[0]).toHaveTextContent(/housing/i);
    expect(listTermItems[1]).toHaveTextContent(/household bills/i);
    expect(listTermItems[2]).toHaveTextContent(/travel/i);
    expect(listTermItems[3]).toHaveTextContent(/borrowing/i);
    expect(listTermItems[4]).toHaveTextContent(/insurance/i);
    expect(listTermItems[5]).toHaveTextContent(/living costs/i);
    expect(listTermItems[6]).toHaveTextContent(/other cost/i);

    // Unknown fallback category name
    expect(listTermItems[7]).toHaveTextContent(/Mock dynamic category/i);

    // Formatted category values
    expect(listDefinitionItems[0]).toHaveTextContent(/£100.00/i);
    expect(listDefinitionItems[1]).toHaveTextContent(/£200.00/i);
    expect(listDefinitionItems[2]).toHaveTextContent(/£300.00/i);
    expect(listDefinitionItems[3]).toHaveTextContent(/£400.00/i);
    expect(listDefinitionItems[4]).toHaveTextContent(/£500.00/i);
    expect(listDefinitionItems[5]).toHaveTextContent(/£678.90/i);
    expect(listDefinitionItems[6]).toHaveTextContent(/£7,890.12/i);
    expect(listDefinitionItems[7]).toHaveTextContent(/£0.00/i);
  });

  it('should render the correct fallback for an invalid input to getSummaryResultsCostsChartColourFromIndex', () => {
    // Invalid numbers
    expect(getSummaryResultsCostsChartColourFromIndex(Number.NaN)).toBe(
      '#00788F',
    );
    expect(
      getSummaryResultsCostsChartColourFromIndex(Number.POSITIVE_INFINITY),
    ).toBe('#00788F');
    expect(
      getSummaryResultsCostsChartColourFromIndex(Number.NEGATIVE_INFINITY),
    ).toBe('#00788F');

    // @ts-expect-error – testing invalid input
    expect(getSummaryResultsCostsChartColourFromIndex('invalid')).toBe(
      '#00788F',
    );

    // Valid input returns expected colour (index 0)
    expect(getSummaryResultsCostsChartColourFromIndex(0)).toBe('#00788F');
  });
});
