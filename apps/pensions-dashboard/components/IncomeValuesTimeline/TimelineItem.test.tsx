import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { TimelineItem } from './TimelineItem';

jest.mock('@maps-react/hooks/useTranslation');

const mockIncome = {
  year: 2024,
  monthlyAmount: 1500,
  annualAmount: 18000,
  lumpSumAmount: 5000,
  difference: 100,
};

describe('TimelineItem', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders complete income details with all values', () => {
    render(<TimelineItem income={mockIncome} />);

    const increaseSpan = screen.getByTestId('income-difference');

    expect(screen.getByTestId('income-item-2024')).toBeInTheDocument();
    expect(screen.getByTestId('income-monthly')).toBeInTheDocument();
    expect(screen.getByTestId('income-lump-sum')).toBeInTheDocument();
    expect(increaseSpan).toBeInTheDocument();
    expect(increaseSpan).toHaveClass('text-green-700');
  });

  it('displays decrease in red when difference is negative', () => {
    render(<TimelineItem income={{ ...mockIncome, difference: -100 }} />);

    expect(screen.getByTestId('income-difference')).toHaveClass('text-red-700');
  });

  it('does not display difference when it is zero', () => {
    render(<TimelineItem income={{ ...mockIncome, difference: 0 }} />);

    expect(
      screen.queryByText('components.income-timeline.increase'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('components.income-timeline.decrease'),
    ).not.toBeInTheDocument();
  });

  it('does not display difference when it is undefined', () => {
    render(<TimelineItem income={{ ...mockIncome, difference: undefined }} />);

    expect(
      screen.queryByText('components.income-timeline.increase'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('components.income-timeline.decrease'),
    ).not.toBeInTheDocument();
  });

  it('does not display lump sum when it is zero', () => {
    render(<TimelineItem income={{ ...mockIncome, lumpSumAmount: 0 }} />);

    expect(
      screen.queryByText('components.income-timeline.lumpSumText'),
    ).not.toBeInTheDocument();
  });
});
