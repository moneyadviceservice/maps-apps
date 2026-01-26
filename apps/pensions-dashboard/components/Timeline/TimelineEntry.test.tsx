import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { Pension, TimelineEntry } from './TimelineEntry';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockArrangement: Pension = {
  id: 'test-pension-1',
  schemeName: 'Test Pension Scheme',
  pensionType: 'DC',
  payableDate: '2024-01-01',
  monthlyAmount: 500,
  lumpSumAmount: 10000,
  lumpSumPayableDate: '2024-01-01',
};

describe('TimelineEntry', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders component with all details', () => {
    render(<TimelineEntry arrangement={mockArrangement} year="2024" />);
    expect(screen.getByText('Test Pension Scheme')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-estimated-income')).toBeInTheDocument();
    expect(screen.getByText('£500 common.a-month')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-lump-sum')).toBeInTheDocument();
    expect(screen.getByText('£10,000')).toBeInTheDocument();
  });

  it('does not render monthly amount when not provided', () => {
    const arrangementWithoutMonthly = {
      ...mockArrangement,
      monthlyAmount: undefined,
    };
    render(
      <TimelineEntry arrangement={arrangementWithoutMonthly} year="2024" />,
    );

    expect(
      screen.queryByTestId('timeline-estimated-income'),
    ).not.toBeInTheDocument();
  });

  it('does not render lump sum when amount is not provided', () => {
    const arrangementWithoutLumpSum = {
      ...mockArrangement,
      lumpSumAmount: undefined,
    };
    render(
      <TimelineEntry arrangement={arrangementWithoutLumpSum} year="2024" />,
    );

    expect(screen.queryByTestId('timeline-lump-sum')).not.toBeInTheDocument();
  });

  it('does not render lump sum when payable date does not match year', () => {
    render(<TimelineEntry arrangement={mockArrangement} year="2025" />);

    expect(screen.queryByTestId('timeline-lump-sum')).not.toBeInTheDocument();
  });

  it('does not render lump sum when payable date is invalid', () => {
    const arrangementWithInvalidDate = {
      ...mockArrangement,
      lumpSumPayableDate: 'invalid-date',
    };
    render(
      <TimelineEntry arrangement={arrangementWithInvalidDate} year="2024" />,
    );

    expect(screen.queryByTestId('timeline-lump-sum')).not.toBeInTheDocument();
  });

  it.each`
    pensionType
    ${'DC'}
    ${'DB'}
  `(
    'renders sr-only pension type for accessibility for $pensionType pension',
    ({ pensionType }) => {
      render(
        <TimelineEntry
          arrangement={{
            ...mockArrangement,
            pensionType,
          }}
          year="2024"
        />,
      );

      expect(screen.getByTestId('timeline-entry-type')).toBeInTheDocument();
      expect(screen.getByTestId('timeline-entry-type')).toHaveClass('sr-only');
      expect(screen.getByTestId('timeline-entry-type')).toHaveTextContent(
        `pages.your-pensions-timeline.key.items.${pensionType}`,
      );
    },
  );

  it('does not render sr-only pension type for accessibility for State Pension', () => {
    render(
      <TimelineEntry
        arrangement={{
          ...mockArrangement,
          pensionType: 'SP',
        }}
        year="2024"
      />,
    );

    expect(screen.queryByTestId('timeline-entry-type')).not.toBeInTheDocument();
  });
});
