import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionType } from '../../lib/constants';
import { BuiltIllustration, ChartIllustration } from '../../lib/types';
import { IncomeValuesAccordions } from './IncomeValuesAccordions';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockIllustration = {
  eri: {
    payableDate: '2049-08-23',
    survivorBenefit: true,
    safeguardedBenefit: true,
    warnings: [],
    benefitType: 'DB',
    calculationMethod: 'BS',
    amountType: 'INC',
    increasing: true,
    monthlyAmount: 1000,
    annualAmount: 12000,
    amount: 15000,
  },
  ap: {
    payableDate: '2049-08-23',
    survivorBenefit: true,
    safeguardedBenefit: true,
    warnings: [],
    benefitType: 'DB',
    calculationMethod: 'BS',
    amountType: 'INC',
    increasing: true,
    monthlyAmount: 333.33,
    annualAmount: 4000,
    amount: 5000,
  },
} as ChartIllustration;

const mockBuiltIllustration: BuiltIllustration = {
  bar: mockIllustration,
  donut: mockIllustration,
  calcType: PensionType.DB,
  payableYear: 2049,
  illustrationDate: '2024-01-01',
};

const dcIllustration = {
  ...mockBuiltIllustration,
  calcType: PensionType.DC,
};

describe('IncomeValuesAccordions', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders all child components with bar type', () => {
    render(<IncomeValuesAccordions item={mockBuiltIllustration} type="bar" />);

    expect(screen.getByTestId('db-calculation-accordion')).toBeInTheDocument();
    expect(screen.getByTestId('features')).toBeInTheDocument();
    expect(screen.getByTestId('more-details')).toBeInTheDocument();
    expect(screen.getByTestId('illustration-date')).toBeInTheDocument();
    expect(screen.getByText('1 January 2024')).toBeInTheDocument();
  });

  it('renders all child components with donut type', () => {
    render(
      <IncomeValuesAccordions item={mockBuiltIllustration} type="donut" />,
    );

    expect(
      screen.getByTestId('db-calculation-accordion-donut'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('features-donut')).toBeInTheDocument();
    expect(screen.getByTestId('more-details-donut')).toBeInTheDocument();
    expect(screen.getByTestId('illustration-date')).toBeInTheDocument();
    expect(screen.getByText('1 January 2024')).toBeInTheDocument();
  });

  it('renders with DC pension type', () => {
    render(<IncomeValuesAccordions item={dcIllustration} type="bar" />);

    expect(screen.getByTestId('dc-calculation-accordion')).toBeInTheDocument();
  });

  it('renders with DC pension type', () => {
    render(<IncomeValuesAccordions item={dcIllustration} type="donut" />);

    expect(
      screen.getByTestId('dc-calculation-accordion-donut'),
    ).toBeInTheDocument();
  });
});
