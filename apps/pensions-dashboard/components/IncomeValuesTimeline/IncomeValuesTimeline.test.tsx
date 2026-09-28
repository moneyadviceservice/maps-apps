import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionArrangement } from '../../lib/types';
import { IncomeValuesTimeline } from './IncomeValuesTimeline';

jest.mock('@maps-react/hooks/useTranslation');

const mockIncome = {
  year: 2024,
  monthlyAmount: 1500,
  annualAmount: 18000,
  lumpSumAmount: 0,
  difference: 100,
};

describe('IncomeValuesTimeline', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly when hasMultipleTranches is true and there is timeline data', () => {
    const data: PensionArrangement = {
      hasMultipleTranches: true,
      hasMultipleIncomeOptions: false,
      detailData: {
        incomeAndValues: {
          standardIncome: [mockIncome],
          legacyIncome: [mockIncome],
          alternativeIncome: [mockIncome],
        },
      },
    } as PensionArrangement;

    render(<IncomeValuesTimeline data={data} />);
    expect(screen.getByTestId('income-values-timeline')).toBeInTheDocument();
    expect(
      screen.getByTestId('income-values-multiplicity'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('income-values-standard-list'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('income-values-mccloud'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('income-values-legacy-list'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('income-values-alternative-list'),
    ).not.toBeInTheDocument();
  });

  it('should render correctly when hasMultipleIncomeOptions is true and there is timeline data', () => {
    const data: PensionArrangement = {
      hasMultipleTranches: false,
      hasMultipleIncomeOptions: true,
      detailData: {
        incomeAndValues: {
          standardIncome: [mockIncome],
          legacyIncome: [mockIncome],
          alternativeIncome: [mockIncome],
        },
      },
    } as PensionArrangement;

    render(<IncomeValuesTimeline data={data} />);
    expect(screen.getByTestId('income-values-timeline')).toBeInTheDocument();
    expect(
      screen.getByTestId('income-values-multiplicity'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('income-values-mccloud')).toBeInTheDocument();
    expect(screen.getByTestId('income-values-legacy-list')).toBeInTheDocument();
    expect(
      screen.getByTestId('income-values-alternative-list'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('income-values-legacy-label'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('income-values-alternative-label'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('income-values-standard-list'),
    ).not.toBeInTheDocument();
  });

  it('should return null when no timeline data and no multiple tranches or income options', () => {
    const data: PensionArrangement = {
      hasMultipleTranches: false,
      hasMultipleIncomeOptions: false,
      detailData: {
        incomeAndValues: {},
      },
    } as PensionArrangement;

    render(<IncomeValuesTimeline data={data} />);
    expect(screen.queryByTestId('income-values-timeline')).toBeNull();
  });
});
