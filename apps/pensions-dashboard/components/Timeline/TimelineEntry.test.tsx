import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionType } from '../../lib/constants';
import { mockTimelineData } from '../../lib/mocks';
import { TimelineArrangement } from '../../lib/types';
import { TimelineEntry } from './TimelineEntry';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockArrangement = mockTimelineData.years[3]
  .arrangements[4] as TimelineArrangement;

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
    render(<TimelineEntry year={2045} arrangement={mockArrangement} />);
    expect(screen.getByText('Oakfield Secure Pension')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-estimated-income')).toBeInTheDocument();
    expect(screen.getByText('£1,200 common.a-month')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-lump-sum')).toBeInTheDocument();
    expect(screen.getByText('£50,000')).toBeInTheDocument();
  });

  it('does not render monthly amount when not provided', () => {
    const arrangementWithoutMonthly = {
      ...mockArrangement,
      monthlyAmount: undefined,
    };
    render(
      <TimelineEntry year={2045} arrangement={arrangementWithoutMonthly} />,
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
      <TimelineEntry year={2045} arrangement={arrangementWithoutLumpSum} />,
    );

    expect(screen.queryByTestId('timeline-lump-sum')).not.toBeInTheDocument();
  });

  it.each`
    pensionType
    ${'DC'}
    ${'DB'}
    ${'HYB'}
    ${'AVC'}
  `(
    'renders sr-only pension type for accessibility for $pensionType pension',
    ({ pensionType }) => {
      render(
        <TimelineEntry
          year={2045}
          arrangement={{
            ...mockArrangement,
            pensionType,
          }}
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
        year={2045}
        arrangement={{
          ...mockArrangement,
          pensionType: PensionType.SP,
        }}
      />,
    );

    expect(screen.queryByTestId('timeline-entry-type')).not.toBeInTheDocument();
  });
});
