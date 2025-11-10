import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import {
  mockPensionDetailsDBRecurring,
  mockPensionDetailsDCRecurring,
  mockPensionDetailsSP,
} from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { Timeline } from './Timeline';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');
const mockPensionData = [
  mockPensionDetailsDCRecurring as PensionArrangement,
  mockPensionDetailsSP as PensionArrangement,
  mockPensionDetailsDBRecurring as PensionArrangement,
];

describe('Timeline', () => {
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

  it('renders timeline with single pension arrangement', () => {
    render(<Timeline data={[mockPensionData[0]]} />);

    expect(screen.getByTestId('timeline-year-2042')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-year-monthly')).toHaveTextContent(
      '£958.50',
    );
    expect(screen.getByTestId('timeline-year-annual')).toHaveTextContent(
      '£11,502',
    );
    expect(screen.getByTestId('timeline-accordion-2042')).toBeInTheDocument();
  });

  it('renders timeline with multiple pension arrangements (ERI and Lump Sum) and years', () => {
    render(<Timeline data={mockPensionData} />);
    const accordionItems = screen.getAllByTestId('timeline-entry');

    expect(accordionItems.length).toBe(4);
    expect(
      screen.getByText('pages.your-pensions-timeline.hide-pensions (3)'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('pages.your-pensions-timeline.hide-pensions (1)'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('timeline-year-2026')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-year-2042')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-accordion-2026')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-accordion-2042')).toBeInTheDocument();
  });

  it('does not render with empty arrangements', () => {
    render(<Timeline data={[]} />);

    expect(screen.queryByTestId('timeline')).not.toBeInTheDocument();
  });

  it('handles pension with no valid illustrations', () => {
    const pensionWithoutIllustrations = {
      ...mockPensionData[0],
      benefitIllustrations: [],
    };

    render(<Timeline data={[pensionWithoutIllustrations]} />);

    expect(screen.queryByTestId('timeline')).not.toBeInTheDocument();
  });

  it('handles pension with lump sum attached to existing ERI entry in same year', () => {
    const pensionWithLumpSumInSameYear = {
      ...mockPensionData[0],
      benefitIllustrations: [
        {
          illustrationDate: '2025-01-01',
          illustrationComponents: [
            {
              illustrationType: 'ERI',
              benefitType: 'DC',
              calculationMethod: 'SMPI',
              payableDetails: {
                payableDate: '2042-03-16',
                annualAmount: 11502,
                monthlyAmount: 958.5,
                amountType: 'INC',
              },
            },
          ],
        },
        {
          illustrationDate: '2025-01-01',
          illustrationComponents: [
            {
              illustrationType: 'ERI',
              benefitType: 'DC',
              calculationMethod: 'SMPI',
              payableDetails: {
                payableDate: '2042-03-16',
                amountType: 'CSH',
                amount: 15000,
              },
            },
          ],
        },
      ],
    } as PensionArrangement;

    render(<Timeline data={[pensionWithLumpSumInSameYear]} />);

    expect(screen.getByTestId('timeline')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-year-2042')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-year-monthly')).toHaveTextContent(
      '£958.50',
    );
    expect(screen.getByTestId('timeline-year-annual')).toHaveTextContent(
      '£11,502',
    );
  });

  it('handles pension with only lump sum (no recurring payments)', () => {
    const pensionLumpSumOnly = {
      ...mockPensionData[2],
      benefitIllustrations: [
        {
          illustrationDate: '2025-01-01',
          illustrationComponents: [
            {
              illustrationType: 'ERI',
              benefitType: 'DB',
              calculationMethod: 'SMPI',
              payableDetails: {
                payableDate: '2026-03-16',
                amountType: 'CSH',
                amount: 9999,
              },
            },
          ],
        },
      ],
    } as PensionArrangement;

    render(<Timeline data={[pensionLumpSumOnly]} />);

    expect(screen.getByTestId('timeline-year-2026')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-year-monthly')).toHaveTextContent('£0');
    expect(screen.getByTestId('timeline-year-annual')).toHaveTextContent('£0');
  });

  it('handles pension with end date correctly', () => {
    const pensionWithEndDate = {
      ...mockPensionData[2],
      benefitIllustrations: [
        {
          illustrationDate: '2024-08-24',
          illustrationComponents: [
            {
              benefitType: 'DB',
              payableDetails: {
                amountType: 'INC',
                payableDate: '2042-02-23',
                lastPaymentDate: '2043-02-23',
                annualAmount: 11502,
                monthlyAmount: 958.5,
              },
              illustrationType: 'ERI',
              calculationMethod: 'BS',
            },
          ],
        },
      ],
    } as PensionArrangement;

    render(<Timeline data={[pensionWithEndDate]} />);

    expect(screen.getByTestId('timeline')).toBeInTheDocument();
    // Should create entries for start year (2042) and end year + 1 (2044)
    expect(screen.getByTestId('timeline-year-2042')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-year-2044')).toBeInTheDocument();
  });
});
