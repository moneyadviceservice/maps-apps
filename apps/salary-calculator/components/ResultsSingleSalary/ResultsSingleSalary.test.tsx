import { render, screen } from '@testing-library/react';
import { ResultsSingleSalary } from './ResultsSingleSalary';
import type { SalaryCalculatorResultsProps } from './ResultsSingleSalary';

import '@testing-library/jest-dom';
import useTranslation from '@maps-react/hooks/useTranslation';

jest.mock('@maps-react/hooks/useTranslation');

import {
  MockFrequencySelector,
  MockResultsTableWithRows,
} from '../../__mocks__/mockResultsComponents';

jest.mock('../FrequencySelector/FrequencySelector', () => ({
  FrequencySelector: (props: any) => <MockFrequencySelector {...props} />,
}));

jest.mock('../ResultsTable', () => ({
  ResultsTable: (props: any) => <MockResultsTableWithRows {...props} />,
}));

const mockUseTranslation = useTranslation as jest.Mock;

beforeEach(() => {
  mockUseTranslation.mockReturnValue({
    z: ({ en }: { en: any; cy: any }) => en,
  });
});

jest.mock(
  '../../utils/helpers/toStudentLoanPlanSelection/toStudentLoanPlanSelection',
  () => ({
    toStudentLoanPlanSelection: jest.fn(() => ['plan2']),
  }),
);

const defaultSalary = {
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

const defaultProps: SalaryCalculatorResultsProps = {
  salary: defaultSalary,
  taxYear: '2025/26' as const,
  resultsFrequency: 'monthly',
};

describe('ResultsSingleSalary', () => {
  it('renders all main sections', () => {
    render(<ResultsSingleSalary {...defaultProps} />);
    expect(screen.getByTestId('results-section')).toBeInTheDocument();
    // There are two headings with the same text, so check both exist
    expect(
      screen.getAllByText('Your estimated take home pay').length,
    ).toBeGreaterThanOrEqual(1);
    // There may be multiple frequency selectors (e.g., for mobile and desktop)
    expect(
      screen.getAllByTestId('frequency-selector').length,
    ).toBeGreaterThanOrEqual(1);
    // There may be multiple results tables (e.g., for mobile and desktop)
    expect(
      screen.getAllByTestId('results-table').length,
    ).toBeGreaterThanOrEqual(1);
  });

  it('initializes with correct frequency', () => {
    render(<ResultsSingleSalary {...defaultProps} />);
    screen
      .getAllByTestId('current-frequency')
      .forEach((el) => expect(el).toHaveTextContent('monthly'));
    screen
      .getAllByTestId('table-frequency')
      .forEach((el) => expect(el).toHaveTextContent('monthly'));
  });

  it('handles empty hours, days, and gross income', () => {
    const propsEmpty = {
      ...defaultProps,
      salary: {
        ...defaultSalary,
        grossIncome: '',
        hoursPerWeek: '',
        daysPerWeek: '',
      },
    };
    render(<ResultsSingleSalary {...propsEmpty} />);
    expect(
      screen.getAllByTestId('results-table').length,
    ).toBeGreaterThanOrEqual(1);
  });

  it('renders with Welsh translation', () => {
    const mockUseTranslation =
      require('@maps-react/hooks/useTranslation').useTranslation;
    mockUseTranslation.mockReturnValue({
      z: (obj: { en: string; cy: string }) => obj.cy,
    });
    render(<ResultsSingleSalary {...defaultProps} />);
    // There may be multiple headings with the same Welsh text, so check all exist
    expect(
      screen.getAllByText('Eich cyflog mynd adref amcangyfrifedig').length,
    ).toBeGreaterThanOrEqual(1);
  });
});
