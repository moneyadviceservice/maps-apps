import React from 'react';

import { ResultsPageData } from 'data/mortgage-affordability/results';
import {
  ExpenseFieldKeys,
  IncomeFieldKeys,
  OtherFieldKeys,
} from 'data/mortgage-affordability/step';
import { convertStringToNumber } from 'utils/convertStringToNumber';
import { formatCurrency } from 'utils/formatCurrency';
import {
  calculateMonthlyPayment,
  calculateRiskLevel,
  calculateRiskPercentage,
  calculateTotalFormValues,
} from 'utils/MortgageAffordabilityCalculator/calculateResultValues';
import { replacePlaceholder } from 'utils/replacePlaceholder';
import { render, screen } from '@testing-library/react';

import { ResultsCallout } from './ResultsCallout';

import '@testing-library/jest-dom/extend-expect';

jest.mock(
  'utils/MortgageAffordabilityCalculator/calculateResultValues',
  () => ({
    calculateMonthlyPayment: jest.fn(),
    calculateRiskPercentage: jest.fn(),
    calculateRiskLevel: jest.fn(),
    calculateTotalFormValues: jest.fn(),
  }),
);

jest.mock('utils/formatCurrency', () => ({
  formatCurrency: jest.fn(),
}));

jest.mock('utils/convertStringToNumber', () => ({
  convertStringToNumber: jest.fn(),
}));

jest.mock('utils/replacePlaceholder', () => ({
  replacePlaceholder: jest.fn(),
}));

describe('ResultsCallout', () => {
  const defaultProps = {
    copy: {
      teaserInfo: {
        success: {
          heading: 'Success Heading',
          text: 'Success text',
          textNext: 'Next success text',
          costsCopy: 'Costs copy',
          leftoverCopy: 'Leftover copy',
        },
        warning: {
          heading: 'Warning Heading',
          text: 'Warning text',
          textNext: 'Next warning text',
          costsCopy: 'Costs copy',
          leftoverCopy: 'Leftover copy',
        },
        error: {
          heading: 'Error Heading',
          text: 'Error text',
          textNext: 'Next error text',
          costsCopy: 'Costs copy',
          leftoverCopy: 'Leftover copy',
        },
        seeSummary: 'See summary',
        estimatedPayments: 'Estimated payments',
        comparedWithRent: 'Compared with rent',
      },
    } as ResultsPageData,
    borrowAmount: 100000,
    term: 25,
    interestRate: 3.5,
    currentRent: 1000,
    formData: {
      [IncomeFieldKeys.TAKE_HOME]: '5000',
      [ExpenseFieldKeys.RENT_MORTGAGE]: '1000',
      [OtherFieldKeys.SECOND_APPLICANT]: 'no',
    },
    isSummary: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();

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

    expect(screen.getByTestId('ResultsCallout')).toBeInTheDocument();
  });

  it('displays correct information when isSummary is false', () => {
    render(<ResultsCallout {...defaultProps} />);

    expect(screen.getByText('Estimated payments')).toBeInTheDocument();
    expect(screen.getByText('Compared with rent')).toBeInTheDocument();
  });

  it('displays correct information when isSummary is true', () => {
    render(<ResultsCallout {...defaultProps} isSummary={true} />);

    expect(screen.getByText('Success Heading')).toBeInTheDocument();
    expect(screen.getByText('Success text')).toBeInTheDocument();
    expect(screen.getByText('Next success text')).toBeInTheDocument();
  });

  it('displays the correct callout variant based on risk level', () => {
    render(<ResultsCallout {...defaultProps} isSummary={true} />);

    expect(screen.getByText('Success Heading').closest('div')).toHaveClass(
      'bg-green-100',
    );

    (calculateRiskLevel as jest.Mock).mockReturnValue('warning');
    render(<ResultsCallout {...defaultProps} isSummary={true} />);
    expect(screen.getByText('Warning Heading').closest('div')).toHaveClass(
      'bg-yellow-150',
    );

    (calculateRiskLevel as jest.Mock).mockReturnValue('error');
    render(<ResultsCallout {...defaultProps} isSummary={true} />);
    expect(screen.getByText('Error Heading').closest('div')).toHaveClass(
      'bg-red-100',
    );
  });

  it('calls the necessary functions with the correct arguments', () => {
    render(<ResultsCallout {...defaultProps} />);

    expect(calculateMonthlyPayment).toHaveBeenCalledWith(
      defaultProps.borrowAmount,
      defaultProps.interestRate,
      defaultProps.term,
    );

    const expenseFields = [
      ExpenseFieldKeys.CARD_AND_LOAN,
      ExpenseFieldKeys.CARE_SCHOOL,
      ExpenseFieldKeys.CHILD_SPOUSAL,
      ExpenseFieldKeys.TRAVEL,
      ExpenseFieldKeys.BILLS_INSURANCE,
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
        isSummary={true}
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
