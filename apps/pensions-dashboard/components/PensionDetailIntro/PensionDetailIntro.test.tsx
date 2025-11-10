import React from 'react';

import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionGroup, PensionType } from '../../lib/constants';
import {
  mockPensionDetailsDBRecurring,
  mockPensionDetailsDCRecurring,
  mockPensionsData,
} from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PensionDetailIntro } from './PensionDetailIntro';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockDCData = mockPensionDetailsDCRecurring as PensionArrangement;
const mockDBData = mockPensionDetailsDBRecurring as PensionArrangement;
const mockNoIncomeData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[9] as PensionArrangement;
const mockPendingPensionData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

describe('PensionDetailIntro', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (
        key: string,
        params?: {
          date?: string;
          income?: string;
          amount?: string;
        },
      ) => {
        switch (key) {
          case 'data.pensions.unavailable-reasons.DCC':
            return `Your provider needs more time to calculate an estimated income. This can take 3 working days. Check back again soon.`;
          case 'data.pensions.unavailable-reasons.WU':
            return `Contact Pension For Everyone: pensionAdministrator.name and give them your reference number. They'll help you resolve any issues with this pension.`;
          case 'common.no-data':
            return 'Unavailable';
          case 'common.a-month':
            return 'a month';
          case 'pages.pension-details.details.you-could-receive':
            return 'You could receive';
          case 'pages.pension-details.details.in-this-pension-pot':
            return 'In this pension pot';
          case 'pages.pension-details.estimate-DB':
            return `from the first payable date of ${params?.date}.`;
          case 'pages.pension-details.estimate-DC':
            return `You could receive ${params?.income} a month from the first payable date of ${params?.date}.`;
          case 'pages.pension-details.lump-sum':
            return `Plus an estimated lump sum payment of ${params?.amount} from ${params?.date}.`;
          default:
            return key;
        }
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders DB pension for GREEN group correctly', () => {
    render(<PensionDetailIntro data={mockDBData} />);

    expect(screen.getByTestId('pension-detail-intro')).toHaveClass(
      'bg-purple-100',
    );
    expect(screen.getByTestId('amount-text')).toHaveClass('text-purple-650');
    expect(screen.getByText('You could receive')).toBeInTheDocument();
    expect(screen.getByText('£958.50 a month')).toBeInTheDocument();
    expect(
      screen.getByText('from the first payable date of 23 February 2042.'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('pension-image')).toHaveAttribute(
      'src',
      '/images/db-illustration.svg',
    );
    expect(
      screen.getByText(
        'Plus an estimated lump sum payment of £19,999 from 16 March 2026.',
      ),
    ).toBeInTheDocument();
  });

  it('renders DC pension for GREEN group correctly', () => {
    render(<PensionDetailIntro data={mockDCData} />);

    expect(screen.getByTestId('pension-detail-intro')).toHaveClass(
      'bg-teal-100',
    );
    expect(screen.getByTestId('amount-text')).toHaveClass('text-teal-700');
    expect(screen.getByText('In this pension pot')).toBeInTheDocument();
    expect(screen.getByText('£4,500')).toBeInTheDocument();
    expect(
      screen.getByText(
        'You could receive £958.50 a month from the first payable date of 23 February 2042.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId('pension-image')).toHaveAttribute(
      'src',
      '/images/dc-illustration.svg',
    );
  });

  it('renders DB pension with no data correctly', () => {
    const pension = {
      ...mockNoIncomeData,
      pensionType: PensionType.DB,
      group: PensionGroup.GREEN,
    };

    render(<PensionDetailIntro data={pension} />);

    expect(screen.getByText('£ Unavailable')).toBeInTheDocument();
  });

  it('renders DC pension with no data correctly', () => {
    const pension = {
      ...mockNoIncomeData,
      pensionType: PensionType.DC,
      group: PensionGroup.GREEN,
      benefitIllustrations: [],
    };

    render(<PensionDetailIntro data={pension} />);

    expect(screen.getByText('£ Unavailable')).toBeInTheDocument();
  });

  it('renders unavailable reason for GREEN_NO_INCOME group', () => {
    const pension = {
      ...mockNoIncomeData,
      group: PensionGroup.GREEN_NO_INCOME,
    };

    render(<PensionDetailIntro data={pension} unavailableCode="DCC" />);

    expect(
      screen.getByText(
        'Your provider needs more time to calculate an estimated income. This can take 3 working days. Check back again soon.',
      ),
    ).toBeInTheDocument();
  });

  it('renders unavailable reason for YELLOW group', () => {
    const pension = {
      ...mockPendingPensionData,
      group: PensionGroup.YELLOW,
    };

    render(<PensionDetailIntro data={pension} unavailableCode="WU" />);
    expect(
      screen.getByText(
        `Contact Pension For Everyone: pensionAdministrator.name and give them your reference number. They'll help you resolve any issues with this pension.`,
      ),
    ).toBeInTheDocument();
  });

  it('does not render summary content if RED group', () => {
    const pension = {
      ...mockPendingPensionData,
      group: PensionGroup.RED,
    };

    render(<PensionDetailIntro data={pension} />);
    expect(screen.queryByTestId('summary-content')).not.toBeInTheDocument();
  });

  it('renders default amount text if not DB or DC', () => {
    const pension = {
      ...mockPendingPensionData,
      pensionType: PensionType.SP,
      group: PensionGroup.GREEN,
    };

    render(<PensionDetailIntro data={pension} />);
    expect(screen.getByTestId('amount-text')).toHaveTextContent(
      '£ Unavailable',
    );
  });

  it('returns null when data is null', () => {
    render(<PensionDetailIntro data={null} />);
    expect(
      screen.queryByTestId('pension-detail-intro'),
    ).not.toBeInTheDocument();
  });
});
