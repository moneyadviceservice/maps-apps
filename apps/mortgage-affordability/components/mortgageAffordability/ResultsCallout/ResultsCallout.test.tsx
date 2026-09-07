import { render, screen } from '@testing-library/react';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import {
  ExpenseFieldKeys,
  IncomeFieldKeys,
  OtherFieldKeys,
} from 'data/mortgage-affordability/step';
import { convertStringToNumber } from '@maps-react/pension-tools/utils/convertStringToNumber';
import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';

import {
  calculateLeftOver,
  calculateMonthlyPayment,
  calculateRiskLevel,
  calculateRiskPercentage,
  calculateTotalFormValues,
} from 'utils/MortgageAffordabilityCalculator/calculateResultValues';
import { replacePlaceholder } from '@maps-react/pension-tools/utils/replacePlaceholder';

import { ResultsCallout } from './ResultsCallout';

import '@testing-library/jest-dom/extend-expect';
import { resultsCalloutCopy } from 'data/mortgage-affordability/results';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('data/mortgage-affordability/results');
jest.mock(
  'utils/MortgageAffordabilityCalculator/calculateResultValues',
  () => ({
    calculateLeftOver: jest.fn(),
    calculateMonthlyPayment: jest.fn(),
    calculateRiskPercentage: jest.fn(),
    calculateRiskLevel: jest.fn(),
    calculateTotalFormValues: jest.fn(),
  }),
);

jest.mock('@maps-react/pension-tools/utils/formatCurrency', () => ({
  formatCurrency: jest.fn(),
}));

jest.mock('@maps-react/pension-tools/utils/convertStringToNumber', () => ({
  convertStringToNumber: jest.fn(),
}));

jest.mock('@maps-react/pension-tools/utils/replacePlaceholder', () => ({
  replacePlaceholder: jest.fn(),
}));

describe('ResultsCallout', () => {
  const defaultProps = {
    borrowAmount: 100000,
    term: 25,
    interest: 3.5,
    monthlyIncome: 2000,
    currentRent: 1000,
    fixedAndCommittedCosts: 200,
    livingCosts: 200,
    formData: {
      [IncomeFieldKeys.TAKE_HOME]: '5000',
      [ExpenseFieldKeys.RENT_MORTGAGE]: '1000',
      [OtherFieldKeys.SECOND_APPLICANT]: 'no',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useTranslation as jest.Mock).mockReturnValue({
      z: (key: { en: string; cy: string }) => key.en,
    });

    (resultsCalloutCopy as jest.Mock).mockReturnValue({
      teaserInfo: {
        warning: {
          heading: 'heading',
          text: 'text',
        },
        success: {
          heading: 'heading',
          text: 'text',
        },
      },
    });

    (calculateLeftOver as jest.Mock).mockReturnValue(200);
    (calculateMonthlyPayment as jest.Mock).mockReturnValue(500);
    (calculateRiskPercentage as jest.Mock).mockReturnValue(20);
    (calculateRiskLevel as jest.Mock).mockReturnValue('success');
    (calculateTotalFormValues as jest.Mock).mockReturnValue(1000);
    (formatCurrency as jest.Mock).mockReturnValue('formattedCurrency');
    (convertStringToNumber as jest.Mock).mockReturnValue(1000);
    (replacePlaceholder as jest.Mock).mockImplementation(
      (placeholder, value, text) => text.replace(placeholder, value),
    );
  });

  it('renders without crashing', () => {
    render(<ResultsCallout {...defaultProps} />);

    expect(
      screen.getByTestId('callout-positive-ResultsCallout'),
    ).toBeInTheDocument();
  });

  it('calls the necessary functions with the correct arguments', () => {
    render(<ResultsCallout {...defaultProps} />);

    expect(calculateMonthlyPayment).toHaveBeenCalledTimes(2);
    expect(calculateMonthlyPayment).toHaveBeenNthCalledWith(
      1,
      defaultProps.borrowAmount,
      defaultProps.interest,
      defaultProps.term,
    );
    expect(calculateMonthlyPayment).toHaveBeenNthCalledWith(
      2,
      defaultProps.borrowAmount,
      defaultProps.interest + 3,
      defaultProps.term,
    );

    expect(calculateLeftOver).toHaveBeenCalledWith(
      defaultProps.monthlyIncome,
      defaultProps.fixedAndCommittedCosts,
      defaultProps.livingCosts,
      500,
    );

    const expenseFields = [
      ExpenseFieldKeys.CARD_AND_LOAN,
      ExpenseFieldKeys.CARE_SCHOOL,
      ExpenseFieldKeys.CHILD_SPOUSAL,
      ExpenseFieldKeys.TRAVEL,
      ExpenseFieldKeys.BILLS_INSURANCE,
      ExpenseFieldKeys.LEISURE,
      ExpenseFieldKeys.HOLIDAYS,
      ExpenseFieldKeys.GROCERIES,
    ];
    const incomeFields = [IncomeFieldKeys.TAKE_HOME];

    expect(calculateRiskPercentage).toHaveBeenCalledWith(
      expenseFields,
      incomeFields,
      500,
      defaultProps.formData,
    );
    expect(calculateRiskLevel).toHaveBeenCalledWith(20);
  });

  it('handles a second applicant correctly', () => {
    const formDataWithSecondApplicant = {
      ...defaultProps.formData,
      [OtherFieldKeys.SECOND_APPLICANT]: 'yes',
      [IncomeFieldKeys.SEC_TAKE_HOME]: '3000',
    };
    render(
      <ResultsCallout
        {...defaultProps}
        formData={formDataWithSecondApplicant}
      />,
    );

    const incomeFieldsWithSecondApplicant = [
      IncomeFieldKeys.TAKE_HOME,
      IncomeFieldKeys.SEC_TAKE_HOME,
    ];

    expect(calculateRiskPercentage).toHaveBeenCalledWith(
      expect.any(Array),
      incomeFieldsWithSecondApplicant,
      500,
      formDataWithSecondApplicant,
    );
  });
});
