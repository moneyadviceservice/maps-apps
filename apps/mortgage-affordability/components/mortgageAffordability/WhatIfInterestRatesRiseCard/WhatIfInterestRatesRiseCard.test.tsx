import { render, screen } from '@testing-library/react';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';
import {
  calculateLeftOver,
  calculateMonthlyPayment,
} from 'utils/MortgageAffordabilityCalculator/calculateResultValues';

import { WhatIfInterestRatesRiseCopy } from 'data/mortgage-affordability/what-if-interest-rates-rise';
import {
  WhatIfInterestRatesRiseCard,
  Props,
} from './WhatIfInterestRatesRiseCard';

import '@testing-library/jest-dom/extend-expect';
import { expectTableWith } from '@maps-react/common/components/Table/__tests__/utils';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('data/mortgage-affordability/what-if-interest-rates-rise');
jest.mock('@maps-react/pension-tools/utils/formatCurrency', () => ({
  formatCurrency: jest.fn(),
}));
jest.mock(
  'utils/MortgageAffordabilityCalculator/calculateResultValues',
  () => ({
    calculateLeftOver: jest.fn(),
    calculateMonthlyPayment: jest.fn(),
  }),
);

describe('WhatIfInterestRatesRisesCard', () => {
  const getElements = () => {
    return {
      containerEl: screen.queryByTestId('what-if-interest-rates-rise'),
      titleEl: screen.queryByTestId('dtc-title'),
      descriptionEl: screen.queryByTestId('dtc-description'),
      tableEl: screen.getByTestId('dtc-table')?.querySelector('table'),
    };
  };

  const expectTable = (tableEl: HTMLTableElement | null) => {
    expectTableWith({
      tableEl,
      layout: 'fixed',
      columnHeadings: ['Rate', 'New payment', 'Money left'],
      data: {
        rows: [
          {
            cells: [
              { data: '7%', className: 'font-bold' },
              { data: 'formattedCurrency', className: 'font-bold' },
              { data: 'formattedCurrency', className: 'font-bold' },
            ],
          },
          {
            cells: [
              { data: '8%', className: 'font-bold' },
              { data: 'formattedCurrency', className: 'font-bold' },
              { data: 'formattedCurrency', className: 'font-bold' },
            ],
          },
          {
            cells: [
              { data: '9%', className: 'font-bold' },
              { data: 'formattedCurrency', className: 'font-bold' },
              { data: 'formattedCurrency', className: 'font-bold' },
            ],
          },
        ],
      },
    });
  };

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      z: (key: { en: string; cy: string }) => key.en,
    });

    (WhatIfInterestRatesRiseCopy as jest.Mock).mockReturnValue({
      title: 'What if interest rates rise?',
      description: 'Card description',
      tableHeadings: {
        rate: 'Rate',
        newPayment: 'New payment',
        moneyLeft: 'Money left',
      },
    });

    (formatCurrency as jest.Mock).mockReturnValue('formattedCurrency');

    (calculateMonthlyPayment as jest.Mock)
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(1001)
      .mockReturnValueOnce(1002);

    (calculateLeftOver as jest.Mock)
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(1001)
      .mockReturnValueOnce(1002);
  });

  it('Renders correctly', () => {
    render(
      <WhatIfInterestRatesRiseCard
        borrowAmount={1000}
        fixedAndCommittedCosts={200}
        livingCosts={75}
        monthlyIncome={2000}
        interest={4}
        term={25}
      />,
    );

    expect(calculateMonthlyPayment).toHaveBeenNthCalledWith(1, 1000, 7, 25);
    expect(calculateMonthlyPayment).toHaveBeenNthCalledWith(2, 1000, 8, 25);
    expect(calculateMonthlyPayment).toHaveBeenNthCalledWith(3, 1000, 9, 25);
    expect(calculateLeftOver).toHaveBeenNthCalledWith(1, 2000, 200, 75, 1000);
    expect(calculateLeftOver).toHaveBeenNthCalledWith(2, 2000, 200, 75, 1001);
    expect(calculateLeftOver).toHaveBeenNthCalledWith(3, 2000, 200, 75, 1002);

    const { containerEl, titleEl, descriptionEl, tableEl } = getElements();
    expect(containerEl).toBeInTheDocument();
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('What if interest rates rise?');
    expect(descriptionEl).toBeInTheDocument();
    expect(descriptionEl).toHaveTextContent('Card description');
    expectTable(tableEl);
  });
});
