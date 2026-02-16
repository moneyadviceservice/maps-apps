import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionType } from '../../lib/constants';
import { IncomeBarChart, IncomeBarChartProps } from './IncomeBarChart';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

describe('BarCharts', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps: IncomeBarChartProps = {
    ap: { date: '2023-01-01', annualAmount: 10000, monthlyAmount: 833 },
    eri: {
      date: '2030-01-01',
      annualAmount: 15000,
      monthlyAmount: 1250,
    },
    pensionType: PensionType.DB,
  };

  it('renders the component elements', () => {
    render(<IncomeBarChart {...defaultProps} />);
    expect(screen.getByTestId('bar-charts')).toBeInTheDocument();
    expect(screen.getByTestId('bar-heading')).toHaveTextContent(
      'common.estimated-income',
    );
  });

  it('renders the screen reader only content correctly', () => {
    render(<IncomeBarChart {...defaultProps} />);
    const srContent = screen.getByTestId('sr-content');
    expect(srContent).toBeInTheDocument();
    expect(srContent.firstChild).toHaveTextContent(
      'pages.pension-details.details.latest-value (2023) : £10,000 common.a-year, £833 common.a-month',
    );
    expect(srContent.lastChild).toHaveTextContent(
      'pages.pension-details.details.estimate-at-retirement (2030) : £15,000 common.a-year, £1,250 common.a-month',
    );
  });

  it.each([
    [PensionType.AVC, 'bg-magenta-750'],
    [PensionType.DB, 'bg-purple-650'],
    [PensionType.DC, 'bg-teal-700'],
    [PensionType.HYB, 'bg-olive-500'],
  ])('applies correct bar color for %s pension', (type, expectedClass) => {
    render(<IncomeBarChart {...defaultProps} pensionType={type} />);
    expect(screen.getByTestId('bar-1')).toHaveClass(expectedClass);
  });

  it.each([
    [0, '£10,000 common.a-year£833 common.a-month'],
    [1, '£15,000 common.a-year£1,250 common.a-month'],
  ])('renders correct bar label for data index %i', (index, expectedText) => {
    render(<IncomeBarChart {...defaultProps} />);
    expect(screen.getByTestId(`bar-label-${index}`)).toHaveTextContent(
      expectedText,
    );
  });

  it.each([
    [0, 'pages.pension-details.details.latest-value2023'],
    [1, 'pages.pension-details.details.estimate-at-retirement2030'],
  ])('renders correct legend label for index %i', (index, expectedText) => {
    render(<IncomeBarChart {...defaultProps} />);
    expect(screen.getByTestId(`bar-legend-${index}`)).toHaveTextContent(
      expectedText,
    );
  });

  it.each([
    [0, '90px'],
    [1, '135px'],
  ])('calculates correct height for bar %i', (index, expectedHeight) => {
    render(<IncomeBarChart {...defaultProps} />);
    expect(screen.getByTestId(`bar-${index}`)).toHaveStyle(
      `height: ${expectedHeight}`,
    );
  });

  it('handles no data scenario', () => {
    const noData: IncomeBarChartProps = {
      ap: { date: undefined, annualAmount: 0, monthlyAmount: 0 },
      eri: { date: undefined, annualAmount: 0, monthlyAmount: 0 },
      pensionType: PensionType.DC,
    };
    render(<IncomeBarChart {...noData} />);
    expect(screen.getByTestId('bar-0')).toHaveStyle('height: 0px');
    expect(screen.getByTestId('bar-1')).toHaveStyle('height: 0px');
    expect(screen.getByTestId('bar-label-0')).toHaveTextContent(
      'common.unavailable',
    );
    expect(screen.getByTestId('bar-label-1')).toHaveTextContent(
      'common.unavailable',
    );
    expect(screen.getByTestId('bar-legend-0')).toHaveTextContent(
      'pages.pension-details.details.latest-value',
    );
    expect(screen.getByTestId('bar-legend-1')).toHaveTextContent(
      'pages.pension-details.details.estimate-at-retirement',
    );
  });
});
