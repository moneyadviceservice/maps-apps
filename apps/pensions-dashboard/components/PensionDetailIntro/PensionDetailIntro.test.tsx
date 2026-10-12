import React from 'react';

import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { MatchType, PensionGroup, PensionType } from '../../lib/constants';
import {
  mockAVC,
  mockCB,
  mockCBLumpSum,
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
const mockCBData = mockCB as PensionArrangement;
const mockCBLumpSumData = mockCBLumpSum as PensionArrangement;

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
          case 'data/unavailable-reasons.DCC':
            return `Your provider needs more time to calculate an estimated income. This can take 3 working days. Check back again soon.`;
          case 'data/unavailable-reasons.WU':
            return `Contact Pension For Everyone: pensionAdministrator.name and give them your reference number. They'll help you resolve any issues with this pension.`;
          case 'data/unavailable-reasons.MULTIPLE':
            return `We cannot show an estimated income for this pension. See 'Income & values' for more details.`;
          case 'data/unavailable-reasons.SYS_MATCHTYPE':
            return `There's an issue with the data from your pension provider. You do not need to take any action at this point.`;
          case 'data/unavailable-reasons.NEW_MATCHTYPE':
            return `This is a new pension. Your provider needs more time to send us data.`;
          case 'common.unavailable':
            return 'Unavailable';
          case 'common.a-month':
            return 'a month';
          case 'pages.pension-details.details.you-could-receive':
            return 'You could receive';
          case 'pages.pension-details.details.cash-balance-you-could-have':
            return 'Your cash balance could be';
          case 'pages.pension-details.estimate':
            return `from the first payable date of ${params?.date}.`;
          case 'pages.pension-details.estimate-cash-balance':
            return `on the first payable date of ${params?.date}.`;
          case 'pages.pension-details.lump-sum':
            return `Plus an estimated lump sum payment of ${params?.amount}`;
          case 'components.income-timeline.legacy':
            return 'Legacy';
          case 'components.income-timeline.alternative':
            return 'Alternative';
          case 'components.income-timeline.option':
            return 'option';
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
    type               | data            | bgClass               | textClass             | monthly        | lumpSum       | paymentDate
    ${PensionType.DB}  | ${mockDBData}   | ${'bg-purple-100'}    | ${'text-purple-650'}  | ${'£958.50'}   | ${'£19,999'}  | ${'23 February 2042'}
    ${PensionType.HYB} | ${mockHybridDB} | ${'bg-yellow-300/65'} | ${'text-olive-800'}   | ${'£2,639.83'} | ${'£126,712'} | ${'23 October 2040'}
    ${PensionType.DC}  | ${mockDCData}   | ${'bg-teal-100'}      | ${'text-teal-700'}    | ${'£958.50'}   | ${undefined}  | ${'23 February 2042'}
    ${PensionType.AVC} | ${mockAVCData}  | ${'bg-pink-300/40'}   | ${'text-magenta-850'} | ${'£371.67'}   | ${undefined}  | ${'7 December 2038'}
    ${PensionType.HYB} | ${mockHybridDC} | ${'bg-yellow-300/65'} | ${'text-olive-800'}   | ${'£695.83'}   | ${undefined}  | ${'9 September 2040'}
    ${PensionType.CB}  | ${mockCBData}   | ${'bg-tan-500/40'}    | ${'text-gray-600'}    | ${'£371.67'}   | ${undefined}  | ${'7 December 2038'}
  `(
    'renders $type pension for GREEN group correctly',
    ({ type, data, bgClass, textClass, monthly, lumpSum, paymentDate }) => {
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

      if (lumpSum) {
        expect(
          screen.getByText(`Plus an estimated lump sum payment of ${lumpSum}`),
        ).toBeInTheDocument();
      } else {
        expect(
          screen.queryByText(/Plus an estimated lump sum payment/),
        ).not.toBeInTheDocument();
      }
    },
  );

  it('renders CB Lump Sum message correctly', () => {
    render(<PensionDetailIntro data={mockCBLumpSumData} />);

    expect(screen.getByTestId('pension-detail-intro')).toHaveClass(
      'bg-tan-500/40',
    );
    expect(screen.getByTestId('amount-text')).toHaveClass('text-gray-600');
    expect(screen.getByText('Your cash balance could be')).toBeInTheDocument();
    expect(screen.getByText(`£10,000`)).toBeInTheDocument();
    expect(
      screen.getByText(`on the first payable date of 7 December 2038.`),
    ).toBeInTheDocument();

    expect(screen.getByTestId('pension-image')).toHaveAttribute(
      'src',
      `/images/cb-illustration.svg`,
    );
  });

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

  it('renders multiple unavailable reason', () => {
    const pension = {
      ...mockNoIncomeData,
      group: PensionGroup.GREEN_NO_INCOME,
      detailData: {
        ...mockPendingPensionData.detailData,
        unavailableCodes: ['DCC', 'WU'],
      },
    } as PensionArrangement;
    render(<PensionDetailIntro data={pension} />);

    expect(
      screen.getByText(
        `We cannot show an estimated income for this pension. See 'Income & values' for more details.`,
      ),
    ).toBeInTheDocument();
  });

  it('renders McCloud message when legacy or alternative payments have monthly amounts', () => {
    const pension = {
      ...mockHybridDB,
      detailData: {
        ...mockHybridDB.detailData,
        standardPayment: undefined,
        legacyPayment: {
          monthlyAmount: 500,
          payableDate: '2025-01-01',
          benefitType: 'DB',
        },
        alternativePayment: {
          monthlyAmount: 300,
          payableDate: '2025-06-01',
          benefitType: 'DB',
        },
      },
    } as PensionArrangement;

    render(<PensionDetailIntro data={pension} />);

    expect(screen.getByText('You could receive')).toBeInTheDocument();
    expect(screen.getByText('Legacy option')).toBeInTheDocument();
    expect(screen.getByText(`£500 a month`)).toBeInTheDocument();
    expect(screen.getByText('Alternative option')).toBeInTheDocument();
    expect(screen.getByText(`£300 a month`)).toBeInTheDocument();
    expect(
      screen.getByText(`from the first payable date of 1 January 2025.`),
    ).toBeInTheDocument();
  });

  it('does not render image when pension type is not received', () => {
    const pension = {
      ...mockPendingPensionData,
      pensionType: undefined,
    } as PensionArrangement;

    render(<PensionDetailIntro data={pension} />);
    expect(screen.queryByTestId('pension-image')).not.toBeInTheDocument();
  });

  it.each`
    matchType        | expectedText
    ${MatchType.SYS} | ${`There's an issue with the data from your pension provider. You do not need to take any action at this point.`}
    ${MatchType.NEW} | ${`This is a new pension. Your provider needs more time to send us data.`}
  `(
    'renders $matchType intro correctly with unavailable reason',
    ({ matchType, expectedText }) => {
      render(<PensionDetailIntro data={{ ...mockDBData, matchType }} />);
      expect(screen.getByText(expectedText)).toBeInTheDocument();
    },
  );

  it('returns null when data is null', () => {
    render(<PensionDetailIntro data={null} />);
    expect(
      screen.queryByTestId('pension-detail-intro'),
    ).not.toBeInTheDocument();
  });
});
