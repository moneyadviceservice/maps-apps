import React from 'react';

import {
  ResultFieldKeys,
  resultsContent,
} from 'data/mortgage-affordability/results';
import { OtherFieldKeys } from 'data/mortgage-affordability/step';
import { convertStringToNumber } from '@maps-react/pension-tools/utils/convertStringToNumber';
import { fireEvent, render } from '@testing-library/react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { ResultData, ResultsForm } from './ResultsForm';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/pension-tools/utils/convertStringToNumber');
jest.mock('data/mortgage-affordability/results');
jest.mock('utils/MortgageAffordabilityCalculator/validation', () => {
  const ResultFieldKeys = jest.requireActual(
    'data/mortgage-affordability/results',
  ).ResultFieldKeys;
  return {
    validationFunctions: {
      [ResultFieldKeys.BORROW_AMOUNT]: jest.fn(),
      [ResultFieldKeys.TERM]: jest.fn(),
      [ResultFieldKeys.INTEREST]: jest.fn(),
    },
  };
});

describe('ResultsForm', () => {
  const formData = {
    [OtherFieldKeys.SECOND_APPLICANT]: 'no',
  };

  const resultData = {
    [ResultFieldKeys.BORROW_AMOUNT]: '200000',
    [ResultFieldKeys.TERM]: '25',
    [ResultFieldKeys.INTEREST]: '3.5',
    [ResultFieldKeys.LIVING_COSTS]: '10',
  };

  const pageErrors = {};

  const updateChildFormData = jest.fn();

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      z: (key: { en: string; cy: string }) => key.en,
    });
    (resultsContent as jest.Mock).mockReturnValue({
      fields: {
        amountToBorrow: 'Amount to borrow',
        basedOnTerm: 'Based on term',
        interestRate: 'Interest rate',
      },
      teaserInfo: {
        warning: {},
        error: {},
        success: {},
      },
    });
    (convertStringToNumber as jest.Mock).mockImplementation((val) =>
      parseFloat(val?.replaceAll(/,/g, '')),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText } = render(
      <ResultsForm
        formData={formData}
        resultData={resultData}
        lowerBorrowBound={100000}
        upperBorrowBound={500000}
        lang="en"
        pageErrors={pageErrors}
        updateChildFormData={updateChildFormData}
      />,
    );

    expect(getByText('Amount to borrow')).toBeInTheDocument();
    expect(getByText('Based on term')).toBeInTheDocument();
    expect(getByText('Interest rate')).toBeInTheDocument();
  });

  it('renders with default values', () => {
    const emptyResultData = {} as ResultData;

    const { getByTestId } = render(
      <ResultsForm
        formData={formData}
        resultData={emptyResultData}
        lowerBorrowBound={100000}
        upperBorrowBound={500000}
        lang="en"
        pageErrors={pageErrors}
        updateChildFormData={updateChildFormData}
      />,
    );

    const borrowInput = getByTestId(
      ResultFieldKeys.BORROW_AMOUNT,
    ) as HTMLInputElement;

    const termInput = getByTestId(ResultFieldKeys.TERM) as HTMLInputElement;

    const interestInput = getByTestId(
      ResultFieldKeys.INTEREST,
    ) as HTMLInputElement;

    expect(borrowInput.value).toEqual('300,000');
    expect(termInput.value).toEqual('25');
    expect(interestInput.value).toEqual('6');
  });

  it('handles borrow input change', () => {
    const { getByTestId } = render(
      <ResultsForm
        formData={formData}
        resultData={resultData}
        lowerBorrowBound={100000}
        upperBorrowBound={500000}
        lang="en"
        pageErrors={pageErrors}
        updateChildFormData={updateChildFormData}
      />,
    );

    const borrowInput = getByTestId(
      ResultFieldKeys.BORROW_AMOUNT,
    ) as HTMLInputElement;
    fireEvent.change(borrowInput, { target: { value: '290000' } });

    expect(convertStringToNumber).toHaveBeenCalledWith('290,000');
    expect(updateChildFormData).toHaveBeenCalledWith(
      290000,
      ResultFieldKeys.BORROW_AMOUNT,
    );
  });

  it('handles term input change', () => {
    const { getByLabelText } = render(
      <ResultsForm
        formData={formData}
        resultData={resultData}
        lowerBorrowBound={100000}
        upperBorrowBound={500000}
        lang="en"
        pageErrors={pageErrors}
        updateChildFormData={updateChildFormData}
      />,
    );

    const input = getByLabelText('Based on term') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '30' } });

    expect(convertStringToNumber).toHaveBeenCalledWith('30');
    expect(updateChildFormData).toHaveBeenCalledWith(30, ResultFieldKeys.TERM);
  });

  it('handles interest rate input change', () => {
    const { getByLabelText } = render(
      <ResultsForm
        formData={formData}
        resultData={resultData}
        lowerBorrowBound={100000}
        upperBorrowBound={500000}
        lang="en"
        pageErrors={pageErrors}
        updateChildFormData={updateChildFormData}
      />,
    );

    const input = getByLabelText('Interest rate') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '4.0' } });

    expect(convertStringToNumber).toHaveBeenCalledWith('4.0');
    expect(updateChildFormData).toHaveBeenCalledWith(
      4.0,
      ResultFieldKeys.INTEREST,
    );
  });

  it('handles field errors', () => {
    const errors = {
      [`r-${ResultFieldKeys.BORROW_AMOUNT}`]: [
        'Error - Error in borrow amount',
      ],
      [`r-${ResultFieldKeys.TERM}`]: ['Error - Error in term'],
      [`r-${ResultFieldKeys.INTEREST}`]: ['Error - Error in interest'],
    };

    const { getByTestId } = render(
      <ResultsForm
        formData={formData}
        resultData={resultData}
        lowerBorrowBound={100000}
        upperBorrowBound={500000}
        lang="en"
        pageErrors={errors}
        updateChildFormData={updateChildFormData}
      />,
    );

    const borrowError = getByTestId('borrow-error');
    expect(borrowError).toBeInTheDocument();
    expect(borrowError).toHaveAttribute(
      'aria-describedby',
      `r-${ResultFieldKeys.BORROW_AMOUNT}`,
    );

    const termError = getByTestId('term-error');
    expect(termError).toBeInTheDocument();
    expect(termError).toHaveAttribute(
      'aria-describedby',
      `r-${ResultFieldKeys.TERM}`,
    );

    const interestError = getByTestId('interest-error');
    expect(interestError).toBeInTheDocument();
    expect(interestError).toHaveAttribute(
      'aria-describedby',
      `r-${ResultFieldKeys.INTEREST}`,
    );
  });
});
