import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { mockTimelineData } from '../../lib/mocks';
import { TimelineYear } from '../../lib/types';
import { Timeline } from './Timeline';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockData = mockTimelineData.years as TimelineYear[];

describe('Timeline', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          'pages.your-pensions-timeline.view-pensions': 'View pensions',
          'common.cash-balance': 'Cash Balance',
          'common.lump-sum': 'Lump Sum',
          'tooltips.type-CBLUMP': 'This is a tooltip for Cash Balance Lump Sum',
          'tooltips.lump-sum': 'This is a tooltip for Lump Sum',
        };
        return translations[key];
      },
      locale: 'en',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders timeline with single pension arrangement', () => {
    render(<Timeline data={[mockData[0]]} />);

    expect(screen.getByTestId('timeline-year-2030')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-year-monthly')).toHaveTextContent(
      '£800',
    );
    expect(screen.getByTestId('timeline-year-annual')).toHaveTextContent(
      '£9,600',
    );
    expect(screen.getByTestId('timeline-accordion-2030')).toBeInTheDocument();
  });

  it('renders timeline with multiple pension arrangements (ERI and Lump Sum) and years', () => {
    render(<Timeline data={mockData} />);
    const accordionItems = screen.getAllByTestId('timeline-entry');

    expect(accordionItems).toHaveLength(11);
    expect(screen.getByText('View pensions (1)')).toBeInTheDocument();
    expect(screen.getByText('View pensions (2)')).toBeInTheDocument();
    expect(screen.getByText('View pensions (8)')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-year-2030')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-year-2031')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-accordion-2037')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-accordion-2045')).toBeInTheDocument();
  });

  it('renders lump sum and cash balance totals correctly', () => {
    render(<Timeline data={[mockData[3]]} />);

    const cashBalanceTotal = screen.getByTestId('cash-balance-total');
    const lumpSumTotal = screen.getByTestId('lump-sum-total');

    expect(cashBalanceTotal).toBeInTheDocument();
    expect(lumpSumTotal).toBeInTheDocument();
    expect(cashBalanceTotal).toHaveTextContent('+ £20,000');
    expect(
      screen.getByText('This is a tooltip for Cash Balance Lump Sum'),
    ).toBeInTheDocument();
    expect(lumpSumTotal).toHaveTextContent('+ £50,000');
    expect(
      screen.getByText('This is a tooltip for Lump Sum'),
    ).toBeInTheDocument();
  });

  it('renders a 0 value timeline entry correctly', () => {
    render(<Timeline data={[mockData[1]]} />);

    expect(screen.getByTestId('timeline-year-2031')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-year-monthly')).toHaveTextContent('£0');
    expect(screen.getByTestId('timeline-year-annual')).toHaveTextContent('£0');
    expect(
      screen.queryByTestId('timeline-accordion-2031'),
    ).not.toBeInTheDocument();
  });

  it('does not render with empty arrangements', () => {
    render(<Timeline data={[]} />);

    expect(screen.queryByTestId('timeline')).not.toBeInTheDocument();
  });
});
