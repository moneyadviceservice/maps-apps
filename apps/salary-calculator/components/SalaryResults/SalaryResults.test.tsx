import { render, screen } from '@testing-library/react';
import { SalaryResults } from './SalaryResults';
import { SalaryFormData } from 'components/SalaryForm';
import { TaxYear } from 'utils/rates/types';
import { FrequencyType } from 'components/ResultsTable';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('SalaryResults', () => {
  const normalizeSalary = (salary: SalaryFormData) => salary;
  const taxYear: TaxYear = '2025/26';
  const resultsFrequency: FrequencyType = 'monthly';

  const baseSalary1: SalaryFormData = {
    grossIncome: '30000',
    grossIncomeFrequency: 'annual',
    hoursPerWeek: '35',
    daysPerWeek: '5',
    taxCode: '1257L',
    isScottishResident: false,
    country: 'England/NI/Wales',
    pensionType: 'percentage',
    pensionValue: 5,
    studentLoans: {
      plan1: false,
      plan2: false,
      plan4: false,
      plan5: false,
      planPostGrad: false,
    },
    isBlindPerson: false,
    isOverStatePensionAge: false,
    calculated: true,
  };

  const baseSalary2: SalaryFormData = {
    grossIncome: '40000',
    grossIncomeFrequency: 'annual',
    hoursPerWeek: '40',
    daysPerWeek: '5',
    taxCode: 'BR',
    isScottishResident: false,
    country: 'England/NI/Wales',
    pensionType: 'fixed',
    pensionValue: 100,
    studentLoans: {
      plan1: false,
      plan2: true,
      plan4: false,
      plan5: false,
      planPostGrad: false,
    },
    isBlindPerson: false,
    isOverStatePensionAge: false,
    calculated: true,
  };

  it('renders ResultsSingleSalary for single calculation', () => {
    render(
      <SalaryResults
        calculationType="single"
        salary1={baseSalary1}
        salary2={undefined}
        taxYear={taxYear}
        resultsFrequency={resultsFrequency}
        normalizeSalary={normalizeSalary}
      />,
    );
    // There may be multiple headings, so check at least one exists
    const headings = screen.getAllByRole('heading', {
      level: 2,
      name: /your estimated take home pay/i,
    });
    expect(headings.length).toBeGreaterThan(0);
  });

  it('renders ResultsComparisonSalary for joint calculation', () => {
    render(
      <SalaryResults
        calculationType="joint"
        salary1={baseSalary1}
        salary2={baseSalary2}
        taxYear={taxYear}
        resultsFrequency={resultsFrequency}
        normalizeSalary={normalizeSalary}
      />,
    );
    expect(screen.getByText(/breakdown of take home pay/i)).toBeInTheDocument();
  });

  it('renders nothing if not calculated', () => {
    const notCalculated = { ...baseSalary1, calculated: false };
    const { container } = render(
      <SalaryResults
        calculationType="single"
        salary1={notCalculated}
        salary2={undefined}
        taxYear={taxYear}
        resultsFrequency={resultsFrequency}
        normalizeSalary={normalizeSalary}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
