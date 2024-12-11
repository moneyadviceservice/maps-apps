import React from 'react';

import {
  ResultFieldKeys,
  resultsContent,
} from 'data/mortgage-affordability/results';
import { ExpenseFieldKeys } from 'data/mortgage-affordability/step';
import { render } from '@testing-library/react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { ResultsCallout } from '../ResultsCallout';
import { ResultsSummary } from './ResultsSummary';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('data/mortgage-affordability/results');
jest.mock('../ResultsCallout', () => ({
  ResultsCallout: jest.fn(() => <div data-testid="ResultsCallout"></div>),
}));
jest.mock('utils/convertStringToNumber');

describe('ResultsSummary', () => {
  const formData = {
    [ExpenseFieldKeys.RENT_MORTGAGE]: '1500',
  };

  const resultFormData = {
    [ResultFieldKeys.BORROW_AMOUNT]: 300000,
    [ResultFieldKeys.TERM]: 30,
    [ResultFieldKeys.INTEREST]: 3.5,
  };

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({ z: 'en' });
    (resultsContent as jest.Mock).mockReturnValue({
      copy: 'test copy',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render ResultsCallout with the correct props', () => {
    const { getByTestId } = render(
      <ResultsSummary
        formData={formData}
        resultFormData={resultFormData}
        searchQuery=""
      />,
    );

    expect(getByTestId('ResultsCallout')).toBeInTheDocument();
    expect(ResultsCallout).toHaveBeenCalledWith(
      {
        copy: { copy: 'test copy' },
        borrowAmount: 300000,
        term: 30,
        interestRate: 3.5,
        formData: formData,
        isSummary: true,
      },
      {},
    );
  });

  it('should call useTranslation hook', () => {
    render(
      <ResultsSummary
        formData={formData}
        resultFormData={resultFormData}
        searchQuery=""
      />,
    );
    expect(useTranslation).toHaveBeenCalled();
  });

  it('should call resultsContent with the correct argument', () => {
    render(
      <ResultsSummary
        formData={formData}
        resultFormData={resultFormData}
        searchQuery=""
      />,
    );
    expect(resultsContent).toHaveBeenCalledWith('en', '');
  });
});
