import { calculateSalaryBreakdown } from './calculateSalaryBreakdown';
import { toStudentLoanPlanSelection } from 'utils/helpers/toStudentLoanPlanSelection';
import { getSalaryBreakdown } from '../getSalaryBreakdown';
import type { SalaryData } from 'components/ResultsSingleSalary/ResultsSingleSalary';

jest.mock('utils/helpers/toStudentLoanPlanSelection', () => ({
  toStudentLoanPlanSelection: jest.fn(),
}));

jest.mock('../getSalaryBreakdown', () => ({
  getSalaryBreakdown: jest.fn(),
}));

describe('calculateSalaryBreakdown', () => {
  const mockSalary: SalaryData = {
    grossIncome: '50000',
    grossIncomeFrequency: 'annual',
    hoursPerWeek: '40',
    daysPerWeek: '5',
    taxCode: '1257L',
    isBlindPerson: false,
    pensionType: 'percentage',
    pensionValue: 5,
    studentLoans: {
      plan1: false,
      plan2: true,
      plan4: false,
      plan5: false,
      planPostGrad: false,
    },
    country: 'England/NI/Wales',
    isOverStatePensionAge: false,
  };

  const mockTaxYear = '2025/26';

  beforeEach(() => {
    (toStudentLoanPlanSelection as jest.Mock).mockReturnValue(['plan2']);
    (getSalaryBreakdown as jest.Mock).mockReturnValue({ mock: 'result' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('parses inputs correctly and calls helpers with proper arguments', () => {
    const result = calculateSalaryBreakdown(mockSalary, mockTaxYear);

    expect(toStudentLoanPlanSelection).toHaveBeenCalledWith(
      mockSalary.studentLoans,
    );

    expect(getSalaryBreakdown).toHaveBeenCalledWith({
      grossIncome: 50000,
      frequency: 'annual',
      daysPerWeek: 5,
      hoursPerWeek: 40,
      pensionType: 'percentage',
      pensionValue: 5,
      country: 'England/NI/Wales',
      taxYear: mockTaxYear,
      studentLoanPlans: ['plan2'],
      isOverStatePensionAge: false,
      isBlindPerson: false,
      taxCode: '1257L',
    });

    expect(result).toEqual({ mock: 'result' });
  });

  it('handles empty numeric fields by defaulting to 0 or undefined', () => {
    const salaryWithEmptyValues = {
      ...mockSalary,
      grossIncome: '',
      hoursPerWeek: '',
      daysPerWeek: '',
    };

    calculateSalaryBreakdown(salaryWithEmptyValues, mockTaxYear);

    expect(getSalaryBreakdown).toHaveBeenCalledWith(
      expect.objectContaining({
        grossIncome: 0,
        daysPerWeek: 0,
        hoursPerWeek: undefined,
      }),
    );
  });
});
