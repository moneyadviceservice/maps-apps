import { render, screen } from '@testing-library/react';

import { SummaryResultsOtherTools } from './SummaryResultsOtherTools';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => {
  const mapping: Record<string, string | string[]> = {
    // Title
    'summaryPage.tools.title': 'Other tools to try',

    // Budget planner
    'summaryPage.tools.budgetPlanner.title': 'Budget planner',
    'summaryPage.tools.budgetPlanner.content':
      'Keep track of your current household spending, plus tips to improve your finances.',

    // Pension calculator
    'summaryPage.tools.pensionCalculator.title': 'Pension calculator',
    'summaryPage.tools.pensionCalculator.content':
      'Find out how much you might need to save for retirement and the income you’re on track to get.',

    // Benefits calculator
    'summaryPage.tools.benefitsCalculator.title': 'Benefits calculator',
    'summaryPage.tools.benefitsCalculator.content':
      'Check if you’re entitled to any extra payments or grants, including Universal Credit and Pension Credit.',
  };
  return {
    __esModule: true,
    default: () => ({
      t: (key: string) => mapping[key] ?? key,
      z: (obj: { en: string }) => obj.en,
      tList: (key: string) => mapping[key] ?? key,
      locale: 'en',
    }),
  };
});

describe('test SummaryResultsOtherTools component', () => {
  it('should render the component', () => {
    const { container } = render(<SummaryResultsOtherTools />);
    expect(container).toMatchSnapshot();

    // Title
    expect(
      screen.getByRole('heading', { name: /other tools to try/i }),
    ).toBeInTheDocument();

    // Tool cards
    const listItems = screen.getAllByRole('link');
    expect(listItems).toHaveLength(3);

    // Test content of first card – assume other cards are correct if this one is correct, as they use the same components
    expect(listItems[0]).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
    );
    expect(
      screen.getByRole('heading', { name: /budget planner/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /keep track of your current household spending, plus tips to improve your finances./i,
      ),
    ).toBeInTheDocument();
  });
});
