import React from 'react';

import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionGroup, PensionType } from '../../lib/constants';
import {
  mockAVC,
  mockHybrid,
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
const mockAVCData = mockAVC as PensionArrangement;
const mockNoIncomeData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[9] as PensionArrangement;
const mockPendingPensionData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;
const mockHybridDC = mockHybrid[0] as PensionArrangement;
const mockHybridDB = mockHybrid[1] as PensionArrangement;

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
          case 'common.unavailable':
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
          case 'pages.pension-details.estimate-AVC':
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

  it.each`
    type               | data            | bgClass               | textClass            | monthly        | lumpSum       | lumpSumPayment       | paymentDate
    ${PensionType.DB}  | ${mockDBData}   | ${'bg-purple-100'}    | ${'text-purple-650'} | ${'£958.50'}   | ${'£19,999'}  | ${'16 March 2026'}   | ${'23 February 2042'}
    ${PensionType.HYB} | ${mockHybridDB} | ${'bg-yellow-300/65'} | ${'text-olive-800'}  | ${'£2,639.83'} | ${'£126,712'} | ${'23 October 2040'} | ${'23 October 2040'}
  `(
    'renders $type pension for GREEN group correctly',
    ({
      type,
      data,
      bgClass,
      textClass,
      monthly,
      lumpSum,
      lumpSumPayment,
      paymentDate,
    }) => {
      render(<PensionDetailIntro data={data} />);

      expect(screen.getByTestId('pension-detail-intro')).toHaveClass(bgClass);
      expect(screen.getByTestId('amount-text')).toHaveClass(textClass);
      expect(screen.getByText('You could receive')).toBeInTheDocument();
      expect(screen.getByText(`${monthly} a month`)).toBeInTheDocument();
      expect(
        screen.getByText(`from the first payable date of ${paymentDate}.`),
      ).toBeInTheDocument();
      expect(screen.getByTestId('pension-image')).toHaveAttribute(
        'src',
        `/images/${type.toLowerCase()}-illustration.svg`,
      );
      expect(
        screen.getByText(
          `Plus an estimated lump sum payment of ${lumpSum} from ${lumpSumPayment}.`,
        ),
      ).toBeInTheDocument();
    },
  );

  it.each`
    type               | data            | bgClass               | textClass             | potValue     | monthly      | paymentDate
    ${PensionType.DC}  | ${mockDCData}   | ${'bg-teal-100'}      | ${'text-teal-700'}    | ${'£4,500'}  | ${'£958.50'} | ${'23 February 2042'}
    ${PensionType.AVC} | ${mockAVCData}  | ${'bg-pink-300/40'}   | ${'text-magenta-750'} | ${'£64,800'} | ${'£371.67'} | ${'7 December 2038'}
    ${PensionType.HYB} | ${mockHybridDC} | ${'bg-yellow-300/65'} | ${'text-olive-800'}   | ${'£14,800'} | ${'£695.83'} | ${'9 September 2040'}
  `(
    'renders $type pension for GREEN group correctly',
    ({ type, data, bgClass, textClass, potValue, monthly, paymentDate }) => {
      render(<PensionDetailIntro data={data} />);

      expect(screen.getByTestId('pension-detail-intro')).toHaveClass(bgClass);
      expect(screen.getByText('In this pension pot')).toBeInTheDocument();
      expect(screen.getByTestId('amount-text')).toHaveClass(textClass);
      expect(screen.getByTestId('amount-text')).toHaveTextContent(potValue);
      expect(
        screen.getByText(
          `You could receive ${monthly} a month from the first payable date of ${paymentDate}.`,
        ),
      ).toBeInTheDocument();
      expect(screen.getByTestId('pension-image')).toHaveAttribute(
        'src',
        `/images/${type.toLowerCase()}-illustration.svg`,
      );
    },
  );

  it('renders unavailable reason for GREEN_NO_INCOME group', () => {
    const pension = {
      ...mockNoIncomeData,
      group: PensionGroup.GREEN_NO_INCOME,
    };

    render(<PensionDetailIntro data={pension} />);

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

    render(<PensionDetailIntro data={pension} />);
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
    expect(screen.getByTestId('amount-text')).toHaveTextContent('Unavailable');
  });

  it('returns null when data is null', () => {
    render(<PensionDetailIntro data={null} />);
    expect(
      screen.queryByTestId('pension-detail-intro'),
    ).not.toBeInTheDocument();
  });
});
