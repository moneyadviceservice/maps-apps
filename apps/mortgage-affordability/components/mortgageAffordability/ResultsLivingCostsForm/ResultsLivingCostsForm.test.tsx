import React from 'react';

import {
  ResultFieldKeys,
  resultsContent,
} from 'data/mortgage-affordability/results';
import { convertStringToNumber } from '@maps-react/pension-tools/utils/convertStringToNumber';
import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';
import {
  calculateLeftOver,
  calculateMonthlyPayment,
} from 'utils/MortgageAffordabilityCalculator/calculateResultValues';
import { fireEvent, render } from '@testing-library/react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { ResultsLivingCostsForm } from './ResultsLivingCostsForm';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/pension-tools/utils/convertStringToNumber');
jest.mock('data/mortgage-affordability/results');
jest.mock('utils/MortgageAffordabilityCalculator/calculateResultValues');
jest.mock('@maps-react/pension-tools/utils/formatCurrency');

describe('ResultsLivingCostsForm', () => {
  const resultData = {
    [ResultFieldKeys.TERM]: 25,
    [ResultFieldKeys.BORROW_AMOUNT]: 300000,
    [ResultFieldKeys.INTEREST]: 3.5,
  };

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      z: (key: { en: string; cy: string }) => key.en,
    });
    (resultsContent as jest.Mock).mockReturnValue({
      whatsLeft: 'What is left',
      youHeaventEnteredLiving: "You haven't entered living costs",
      yourEstimated: 'Your estimated living costs',
      theAmountYou: 'The amount you have left',
      whatsLeftSuccessText: 'You have enough money left over',
      whatsLeftErrorText: 'You do not have enough money left over',
      whatIf: 'What if...',
      ifInterestRatesRise: 'If interest rates rise',
      yourRemainingBudgetWillBe: 'Your remaining budget will be',
    });
    (convertStringToNumber as jest.Mock).mockImplementation((val) =>
      parseFloat(val),
    );
    (calculateMonthlyPayment as jest.Mock).mockReturnValue(1200);
    (calculateLeftOver as jest.Mock).mockReturnValue(800);
    (formatCurrency as jest.Mock).mockImplementation(
      (val) => `£${val.toFixed(2)}`,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText, queryByText } = render(
      <ResultsLivingCostsForm
        resultData={resultData}
        livingCosts={1000}
        monthlyIncome={4000}
        fixedAndCommittedCosts={500}
        searchQuery={''}
      />,
    );

    expect(getByText('What is left')).toBeInTheDocument();
    expect(getByText('Your estimated living costs')).toBeInTheDocument();
    expect(
      queryByText("You haven't entered living costs"),
    ).not.toBeInTheDocument();
  });

  it('renders error when living costs are 0', () => {
    const { getByText } = render(
      <ResultsLivingCostsForm
        resultData={resultData}
        livingCosts={0}
        monthlyIncome={4000}
        fixedAndCommittedCosts={500}
        searchQuery={''}
      />,
    );

    expect(getByText("You haven't entered living costs")).toBeInTheDocument();
  });

  it('updates living costs and bounds when input changes', () => {
    const { getByLabelText } = render(
      <ResultsLivingCostsForm
        resultData={resultData}
        livingCosts={1000}
        monthlyIncome={4000}
        fixedAndCommittedCosts={500}
        searchQuery={''}
      />,
    );

    const input = getByLabelText(
      'Your estimated living costs',
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '2000' } });

    expect(convertStringToNumber).toHaveBeenCalledWith('2000');
    expect(input.value).toBe('2000');
  });

  it('calls calculateMonthlyPayment and calculateLeftOver with correct values', () => {
    render(
      <ResultsLivingCostsForm
        resultData={resultData}
        livingCosts={1000}
        monthlyIncome={4000}
        fixedAndCommittedCosts={500}
        searchQuery={''}
      />,
    );

    expect(calculateMonthlyPayment).toHaveBeenCalledWith(300000, 3.5, 25);
    expect(calculateLeftOver).toHaveBeenCalledWith(4000, 500, 1000, 1200);
  });

  it('formats and displays the calculated left over amount correctly', () => {
    const { getByTestId } = render(
      <ResultsLivingCostsForm
        resultData={resultData}
        livingCosts={1000}
        monthlyIncome={4000}
        fixedAndCommittedCosts={500}
        searchQuery={''}
      />,
    );

    expect(formatCurrency).toHaveBeenCalledWith(800);
    const amountLeftOver = getByTestId('amount-left-over');
    expect(amountLeftOver.textContent).toBe('£800.00');
  });
});
