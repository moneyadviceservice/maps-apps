import { render, screen, fireEvent } from '@testing-library/react';
import { ResultsComparisonSalary } from './ResultsComparisonSalary';
import type { SalaryData } from 'components/ResultsSingleSalary/ResultsSingleSalary';
import '@testing-library/jest-dom';
import useTranslation from '@maps-react/hooks/useTranslation';

import {
  MockFrequencySelector,
  MockResultsTableBase,
} from '../../__mocks__/mockResultsComponents';

jest.mock('@maps-react/hooks/useTranslation');

jest.mock('../FrequencySelector/FrequencySelector', () => ({
  FrequencySelector: (props: any) => <MockFrequencySelector {...props} />,
}));

jest.mock('../ResultsTable', () => ({
  ResultsTable: (props: any) => <MockResultsTableBase {...props} />,
}));

const mockUseTranslation = useTranslation as jest.Mock;

beforeEach(() => {
  mockUseTranslation.mockReturnValue({
    z: ({ en }: { en: any; cy: any }) => en,
  });
});

jest.mock('../FrequencySelector/FrequencySelector', () => ({
  FrequencySelector: ({ currentFrequency, onFrequencyChange }: any) => (
    <div data-testid="frequency-selector">
      <button
        data-testid="change-frequency"
        onClick={() => onFrequencyChange('weekly')}
      >
        Change to Weekly
      </button>
      <span data-testid="current-frequency">{currentFrequency}</span>
    </div>
  ),
}));

jest.mock('../ResultsTable', () => ({
  ResultsTable: ({ rows, columns, frequency }: any) => (
    <div data-testid="results-table">
      <div data-testid="table-frequency">{frequency}</div>
      <div data-testid="table-rows">{rows.length}</div>
      <div data-testid="table-columns">{columns.length}</div>
    </div>
  ),
}));

jest.mock('../../utils/calculations/calculateSalaryBreakdown', () => ({
  calculateSalaryBreakdown: jest.fn((salary: any, taxYear: any) => {
    const gross = Number(salary.grossIncome) || 0;
    const net = gross * 0.75; // 75% take home for simplicity
    return {
      netSalary: {
        yearly: net,
        monthly: net / 12,
        weekly: net / 52,
        daily: net / 260,
      },
      grossSalary: {
        yearly: gross,
        monthly: gross / 12,
        weekly: gross / 52,
        daily: gross / 260,
      },
    };
  }),
}));

const defaultSalary: SalaryData = {
  grossIncome: '50000',
  grossIncomeFrequency: 'annual' as const,
  hoursPerWeek: '40',
  daysPerWeek: '5',
  taxCode: '1257L',
  isBlindPerson: false,
  pensionType: 'percentage' as const,
  pensionValue: 5,
  studentLoans: {
    plan1: false,
    plan2: false,
    plan4: false,
    plan5: false,
    planPostGrad: false,
  },
  country: 'England/NI/Wales' as const,
  isOverStatePensionAge: false,
};

describe('ResultsComparisonSalary', () => {
  const props = {
    salary1: defaultSalary,
    salary2: { ...defaultSalary, grossIncome: '60000' },
    taxYear: '2025/26' as const,
    resultsFrequency: 'monthly' as const,
  };

  it('renders heading, description, frequency selector, and table', () => {
    render(<ResultsComparisonSalary {...props} />);
    expect(
      screen.getByText('Breakdown of take home pay for each salary'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Your take home pay difference is/i),
    ).toBeInTheDocument();
    // There may be multiple frequency selectors (e.g., for mobile and desktop)
    expect(screen.getAllByTestId('frequency-selector').length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByTestId('results-table').length).toBeGreaterThan(0);
  });

  it('calculates and displays the correct difference', () => {
    render(<ResultsComparisonSalary {...props} />);
    // Use a more flexible matcher that checks for the text pattern
    expect(
      screen.getByText(/Your take home pay difference is/i),
    ).toBeInTheDocument();
    // The difference should be (60000-50000) * 0.75 / 12 = 625.00 per month
    expect(screen.getByText(/625\.00/)).toBeInTheDocument();
  });

  it('shows correct message when salaries are equal', () => {
    const equalProps = {
      ...props,
      salary2: { ...props.salary1 },
    };
    render(<ResultsComparisonSalary {...equalProps} />);
    expect(screen.getByText('Both salaries are the same.')).toBeInTheDocument();
  });

  it('updates frequency when changed', () => {
    render(<ResultsComparisonSalary {...props} />);
    const changeButtons = screen.getAllByTestId('change-frequency');
    fireEvent.click(changeButtons[0]);

    const frequencies = screen.getAllByTestId('current-frequency');
    frequencies.forEach((freq) => {
      expect(freq).toHaveTextContent('weekly');
    });
    screen.getAllByTestId('table-frequency').forEach((el) => {
      expect(el).toHaveTextContent('weekly');
    });
  });

  it('renders callout when salary is below threshold', () => {
    const lowSalaryProps = {
      ...props,
      salary1: { ...props.salary1, grossIncome: '30000' },
    };
    render(<ResultsComparisonSalary {...lowSalaryProps} />);
    const callouts = screen.getAllByText(/Are you missing out on extra help/i);
    expect(callouts.length).toBeGreaterThan(0);
  });

  it('renders Welsh translation', () => {
    const mockUseTranslation =
      require('@maps-react/hooks/useTranslation').useTranslation;
    mockUseTranslation.mockReturnValue({
      z: (obj: { en: string; cy: string }) => obj.cy,
    });
    // Use a salary value that triggers the callout
    const lowSalaryProps = {
      ...props,
      salary1: { ...props.salary1, grossIncome: '30000' },
    };
    render(<ResultsComparisonSalary {...lowSalaryProps} />);
    // Use a flexible matcher in case the text is split by elements
    const welshCallouts = screen.getAllByText(
      "Ydych chi'n colli allan ar gymorth ychwanegol?",
    );
    expect(welshCallouts.length).toBeGreaterThan(0);
  });
});
