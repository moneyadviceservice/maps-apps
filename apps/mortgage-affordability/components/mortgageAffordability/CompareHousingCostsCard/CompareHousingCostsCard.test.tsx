import { render, screen } from '@testing-library/react';
import { CompareHousingCostsCard } from '.';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { CompareHousingCostsCopy } from 'data/mortgage-affordability/compare-housing-costs';
import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';

import { expectTableWith } from '@maps-react/common/components/Table/__tests__/utils';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('data/mortgage-affordability/compare-housing-costs');
jest.mock('@maps-react/pension-tools/utils/formatCurrency', () => ({
  formatCurrency: jest.fn(),
}));

describe('CompareHousingCostsCard', () => {
  const getElements = () => {
    return {
      containerEl: screen.queryByTestId('compare-housing-costs'),
      titleEl: screen.queryByTestId('dtc-title'),
      descriptionEl: screen.queryByTestId('dtc-description'),
      tableEl: screen.getByTestId('dtc-table')?.querySelector('table'),
      footnoteEl: screen.queryByTestId('dtc-footnote'),
    };
  };

  const expectTable = (tableEl: HTMLTableElement | null) => {
    expectTableWith({
      tableEl,
      layout: 'fixed',
      data: {
        rows: [
          {
            cells: [
              { isHeading: true, data: 'Rent or current mortgage' },
              { data: 'formattedCurrency', className: 'font-bold' },
            ],
          },
          {
            cells: [
              { isHeading: true, data: 'New mortgage payment' },
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

    (CompareHousingCostsCopy as jest.Mock).mockReturnValue({
      title: 'Compare housing costs',
      rentOrMortgage: 'Rent or current mortgage',
      newMortgagePayment: 'New mortgage payment',
      less: {
        description: 'Less description',
        footnote: 'Less footnote',
      },
      more: {
        description: 'More description',
        footnote: 'More footnote',
      },
      same: {
        description: 'Same description',
        footnote: 'Same footnote',
      },
    });

    (formatCurrency as jest.Mock).mockReturnValue('formattedCurrency');
  });

  it('Renders correctly with new payment costing more', () => {
    render(
      <CompareHousingCostsCard
        currentPaymentPerMonth={1000}
        newPaymentPerMonth={1200}
      />,
    );

    const { containerEl, titleEl, descriptionEl, tableEl, footnoteEl } =
      getElements();

    expect(containerEl).toBeInTheDocument();
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('Compare housing costs');
    expect(descriptionEl).toBeInTheDocument();
    expect(descriptionEl).toHaveTextContent('More description');
    expectTable(tableEl);
    expect(footnoteEl).toBeInTheDocument();
    expect(footnoteEl).toHaveTextContent('More footnote');
  });

  it('Renders correctly with new payment costing the same', () => {
    // Needed as the same checks the value of the formatCurrency result as just checking the difference is not the same
    (formatCurrency as jest.Mock)
      .mockReturnValueOnce('£0.00')
      .mockReturnValue('formattedCurrency');

    render(
      <CompareHousingCostsCard
        currentPaymentPerMonth={1000}
        newPaymentPerMonth={1000}
      />,
    );

    const { containerEl, titleEl, descriptionEl, tableEl, footnoteEl } =
      getElements();

    expect(containerEl).toBeInTheDocument();
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('Compare housing costs');
    expect(descriptionEl).toBeInTheDocument();
    expect(descriptionEl).toHaveTextContent('Same description');
    expectTable(tableEl);
    expect(footnoteEl).toBeInTheDocument();
    expect(footnoteEl).toHaveTextContent('Same footnote');
  });

  it('Renders correctly with new payment costing less', () => {
    render(
      <CompareHousingCostsCard
        currentPaymentPerMonth={1000}
        newPaymentPerMonth={800}
      />,
    );

    const { containerEl, titleEl, descriptionEl, tableEl, footnoteEl } =
      getElements();

    expect(containerEl).toBeInTheDocument();
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('Compare housing costs');
    expect(descriptionEl).toBeInTheDocument();
    expect(descriptionEl).toHaveTextContent('Less description');
    expectTable(tableEl);
    expect(footnoteEl).toBeInTheDocument();
    expect(footnoteEl).toHaveTextContent('Less footnote');
  });
});
