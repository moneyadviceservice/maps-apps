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

  const defaultProps = {
    formData,
    resultData,
    lowerBorrowBound: 100000,
    upperBorrowBound: 500000,
    pageErrors,
  };

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      z: (key: { en: string; cy: string }) => key.en,
    });
    (resultsContent as jest.Mock).mockReturnValue({
      updateTheseFigures:
        'Update these figures to see how they change your monthly budget.',
      fields: {
        amountToBorrow: 'Mortgage amount',
        basedOnTerm: 'Length of mortgage',
        interestRate: 'Interest rate',
      },
      fieldHints: {
        amount:
          'Enter how much you want to borrow. It must be between {lowerBound} and {upperBound}.',
        term: "A longer term lowers your monthly costs, but you'll pay more interest overall.",
        interest: "A higher interest rate means you'll pay more each month.",
      },
      updateMyResults: 'Update my result',
      teaserInfo: {
        warning: {},
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

  it('renders labels, intro and hints without sliders', () => {
    const { getByText, container } = render(<ResultsForm {...defaultProps} />);

    expect(getByText('Mortgage amount')).toBeInTheDocument();
    expect(getByText('Length of mortgage')).toBeInTheDocument();
    expect(getByText('Interest rate')).toBeInTheDocument();
    expect(
      getByText(
        'Update these figures to see how they change your monthly budget.',
      ),
    ).toBeInTheDocument();
    expect(
      getByText(
        'Enter how much you want to borrow. It must be between £100,000 and £500,000.',
      ),
    ).toBeInTheDocument();
    expect(
      getByText(
        "A longer term lowers your monthly costs, but you'll pay more interest overall.",
      ),
    ).toBeInTheDocument();
    expect(
      getByText("A higher interest rate means you'll pay more each month."),
    ).toBeInTheDocument();
    expect(container.querySelector('input[type="range"]')).toBeNull();
  });

  it('links each field to its hint via aria-describedby', () => {
    const { getByTestId, getByRole, container } = render(
      <ResultsForm {...defaultProps} />,
    );

    [ResultFieldKeys.BORROW_AMOUNT, ResultFieldKeys.INTEREST].forEach(
      (field) => {
        const input = getByTestId(field) as HTMLInputElement;
        expect(input).toHaveAttribute(
          'aria-describedby',
          `r-${field}-description`,
        );
        expect(
          container.querySelector(`#r-${field}-description`),
        ).not.toBeNull();
      },
    );

    const termSelect = getByRole('combobox');
    expect(termSelect).toHaveAttribute(
      'aria-description',
      "A longer term lowers your monthly costs, but you'll pay more interest overall.",
    );
    expect(
      container.querySelector(`#r-${ResultFieldKeys.TERM}-description`),
    ).not.toBeNull();
  });

  it('renders with default values', () => {
    const emptyResultData = {} as ResultData;

    const { getByTestId, getByRole } = render(
      <ResultsForm {...defaultProps} resultData={emptyResultData} />,
    );

    const borrowInput = getByTestId(
      ResultFieldKeys.BORROW_AMOUNT,
    ) as HTMLInputElement;

    const termSelect = getByRole('combobox') as HTMLSelectElement;

    const interestInput = getByTestId(
      ResultFieldKeys.INTEREST,
    ) as HTMLInputElement;

    expect(borrowInput.value).toEqual('300,000');
    expect(termSelect.value).toEqual('25');
    expect(interestInput.value).toEqual('4');
  });

  it('renders the term as a dropdown of whole years from 1 to 40', () => {
    const { getByRole, getAllByRole } = render(
      <ResultsForm {...defaultProps} />,
    );

    const termSelect = getByRole('combobox') as HTMLSelectElement;
    expect(termSelect).toHaveAttribute('name', `r-${ResultFieldKeys.TERM}`);

    const optionValues = getAllByRole('option').map(
      (option) => (option as HTMLOptionElement).value,
    );
    expect(optionValues).toHaveLength(40);
    expect(optionValues[0]).toEqual('1');
    expect(optionValues[39]).toEqual('40');

    fireEvent.change(termSelect, { target: { value: '30' } });
    expect(termSelect.value).toEqual('30');
  });

  it('always renders the update results submit button', () => {
    const { getByTestId } = render(<ResultsForm {...defaultProps} />);

    const button = getByTestId('mac-update-results');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Update my result');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('name', 'action');
    expect(button).toHaveAttribute('value', 'recalculate');
  });

  it.each([
    {
      name: 'limits inputs to two decimal places',
      field: ResultFieldKeys.INTEREST,
      typed: '12.345',
      expected: '12.34',
    },
    {
      name: 'strips characters other than numbers and a decimal point',
      field: ResultFieldKeys.INTEREST,
      typed: '1a2b.3c4d',
      expected: '12.34',
    },
    {
      name: 'caps inputs at 999,999,999 while typing',
      field: ResultFieldKeys.BORROW_AMOUNT,
      typed: '1000000000',
      expected: '200,000',
    },
    {
      name: 'allows an interest rate above 100 while typing',
      field: ResultFieldKeys.INTEREST,
      typed: '250',
      expected: '250',
    },
  ])('$name', ({ field, typed, expected }) => {
    const { getByTestId } = render(<ResultsForm {...defaultProps} />);

    const input = getByTestId(field) as HTMLInputElement;
    fireEvent.change(input, { target: { value: typed } });

    expect(input.value).toEqual(expected);
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
      <ResultsForm {...defaultProps} pageErrors={errors} />,
    );

    const borrowError = getByTestId('borrow-error');
    expect(borrowError).toBeInTheDocument();
    expect(borrowError).toHaveTextContent('Error in borrow amount');
    expect(borrowError).toHaveAttribute(
      'aria-describedby',
      `r-${ResultFieldKeys.BORROW_AMOUNT}`,
    );

    const termError = getByTestId('term-error');
    expect(termError).toBeInTheDocument();
    expect(termError).toHaveTextContent('Error in term');
    expect(termError).toHaveAttribute(
      'aria-describedby',
      `r-${ResultFieldKeys.TERM}`,
    );

    const interestError = getByTestId('interest-error');
    expect(interestError).toBeInTheDocument();
    expect(interestError).toHaveTextContent('Error in interest');
    expect(interestError).toHaveAttribute(
      'aria-describedby',
      `r-${ResultFieldKeys.INTEREST}`,
    );
  });

  it('does not render inline errors when there are none', () => {
    const { queryByTestId } = render(<ResultsForm {...defaultProps} />);

    expect(queryByTestId('borrow-error')).toBeNull();
    expect(queryByTestId('term-error')).toBeNull();
    expect(queryByTestId('interest-error')).toBeNull();
  });
});
