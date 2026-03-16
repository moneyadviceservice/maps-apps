import { fireEvent, render, screen } from '@testing-library/react';
import { SummaryBreakdownTotal } from './SummaryBreakdownTotal';
import { mockSubmittedData } from 'lib/mocks/mockRetirementIncome';
import { mockPageData } from 'lib/mocks/mockEssentialOutgoings';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: {
      language: 'en',
    },
  }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => {
  const mapping: Record<string, any> = {
    'summaryPage.chart.title': 'Chart title',
    'summaryPage.chart.description': 'Chart of costs and total summary',
    'summaryPage.chart.label': 'Retirement costs',
    'summaryPage.chart.costCategories.housingCost': 'Housing',
    'summaryPage.chart.costCategories.utilities': 'Household bills',
    'summaryPage.chart.costCategories.travelCosts': 'Travel',
    'summaryPage.chart.costCategories.lending': 'Borrowing',
    'summaryPage.chart.costCategories.insurance': 'Insurance',
    'summaryPage.chart.costCategories.householdExpenses': 'Living costs',
    'summaryPage.chart.costCategories.essentialsAdditionalItems': 'Other costs',
    'summaryTotal.summaryPageTitle': 'Summary total',
    'summaryTotal.income': 'Income',
    'summaryTotal.spending': 'Spending',
    'summaryTotal.balance': 'Balance',
  };
  return {
    __esModule: true,
    default: () => ({
      t: (key: string) => mapping[key] ?? key,
      z: (obj: { en: string }) => obj.en,
      tList: (key: string) => key,
      locale: 'en',
    }),
  };
});

const renderComponent = () =>
  render(
    <SummaryBreakdownTotal
      income={mockSubmittedData}
      costs={mockPageData()}
      divider={'month'}
      tabName="summary"
    />,
  );

describe('Summary breakdown & summary total component', () => {
  it('should render component correctly', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });

  it('should display total income / spending / balance when frequency is the monthly, defualt option', () => {
    renderComponent();

    expect(screen.getByText('£442.26')).toBeTruthy();
    expect(screen.getByText('£1,080.00')).toBeTruthy();
  });

  it('should update total income / spending / balance when update the frequency dropdown', () => {
    renderComponent();

    const dropdown = screen.getByTestId('t-summary-options');

    fireEvent.change(dropdown, { target: { value: 'year' } });

    expect(screen.getByText('£5,307.14')).toBeTruthy();
    expect(screen.getByText('£12,960.00')).toBeTruthy();
  });
});
