import { getRiskLevel } from './getRiskLevel';
import {
  calculateMonthlyPayment,
  calculateRiskLevel,
  calculateRiskPercentage,
} from './calculateResultValues';
import { convertStringToNumber } from 'utils/convertStringToNumber';
import { ResultFieldKeys } from 'data/mortgage-affordability/results';
import {
  ExpenseFieldKeys,
  IncomeFieldKeys,
} from 'data/mortgage-affordability/step';

jest.mock('./calculateResultValues', () => ({
  calculateMonthlyPayment: jest.fn(),
  calculateRiskLevel: jest.fn(),
  calculateRiskPercentage: jest.fn(),
}));

jest.mock('utils/convertStringToNumber', () => ({
  convertStringToNumber: jest.fn(),
}));

describe('getRiskLevel', () => {
  const mockResultData = {
    [ResultFieldKeys.BORROW_AMOUNT]: '500000',
    interest: '5',
    term: '30',
    [ResultFieldKeys.LIVING_COSTS]: '',
  };

  const mockExpenseFields = [
    ExpenseFieldKeys.BILLS_INSURANCE,
    ExpenseFieldKeys.CARD_AND_LOAN,
  ];
  const mockIncomeFields = [
    IncomeFieldKeys.ANNUAL_INCOME,
    IncomeFieldKeys.OTHER_INCOME,
  ];
  const mockFormData = {
    expenseField1: '2000',
    expenseField2: '3000',
    incomeField1: '10000',
    incomeField2: '12000',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate monthly payment, risk percentage, and risk level correctly', () => {
    (convertStringToNumber as jest.Mock).mockImplementation((str) =>
      parseFloat(str),
    );
    (calculateMonthlyPayment as jest.Mock).mockReturnValue(2684);
    (calculateRiskPercentage as jest.Mock).mockReturnValue(0.25);
    (calculateRiskLevel as jest.Mock).mockReturnValue('success');

    const riskLevel = getRiskLevel(
      mockResultData,
      mockExpenseFields,
      mockIncomeFields,
      mockFormData,
    );

    expect(convertStringToNumber).toHaveBeenCalledWith('500000');
    expect(convertStringToNumber).toHaveBeenCalledWith('5');
    expect(convertStringToNumber).toHaveBeenCalledWith('30');

    expect(calculateMonthlyPayment).toHaveBeenCalledWith(500000, 5, 30);
    expect(calculateRiskPercentage).toHaveBeenCalledWith(
      mockExpenseFields,
      mockIncomeFields,
      2684,
      mockFormData,
    );
    expect(calculateRiskLevel).toHaveBeenCalledWith(0.25);

    expect(riskLevel).toBe('success');
  });
});
