import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import {
  BenefitType,
  IllustrationWarning,
  MatchType,
  PensionType,
} from '../../lib/constants';
import { mockPensionsData } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PensionDetailSummary } from './PensionDetailSummary';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockPensionData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[1] as PensionArrangement;

const mockData = {
  ...mockPensionData,
  benefitIllustrations: [
    {
      illustrationComponents: [
        {
          illustrationType: 'ERI',
          benefitType: 'DB',
          calculationMethod: 'SMPI',
          survivorBenefit: false,
          unavailableReason: 'DB',
          safeguardedBenefit: false,
          illustrationWarnings: [
            IllustrationWarning.PSO,
            IllustrationWarning.PEO,
            IllustrationWarning.FAS,
          ],
        },
        {
          illustrationType: 'AP',
          benefitType: 'DC',
          calculationMethod: 'SMPI',
          payableDetails: {
            amountType: 'INC',
            annualAmount: 2530,
            monthlyAmount: 210.83,
            payableDate: '2051-04-01',
            increasing: false,
          },
          survivorBenefit: false,
          safeguardedBenefit: false,
          illustrationWarnings: [
            IllustrationWarning.PNR,
            IllustrationWarning.SCP,
          ],
        },
      ],
      illustrationDate: '2024-01-09',
    },
  ],
  linkedPensions: [
    {
      schemeName: 'Linked Pension Scheme A',
      externalAssetId: 'LP123456A',
      pensionType: 'DC',
    },
  ],
  detailData: {
    warnings: [
      IllustrationWarning.PSO,
      IllustrationWarning.PEO,
      IllustrationWarning.PNR,
      IllustrationWarning.SCP,
      IllustrationWarning.FAS,
    ],
  },
} as PensionArrangement;

describe('PensionDetailSummary', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: (key: string) => [key],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with correct structure', () => {
    render(<PensionDetailSummary data={mockData} />);
    expect(screen.getByTestId('heading')).toBeInTheDocument();
    expect(screen.getByTestId('heading')).toHaveTextContent(
      'pages.pension-details.header.summary',
    );
    expect(screen.getByTestId('detail-summary-intro')).toBeInTheDocument();
    expect(screen.getByTestId('pension-detail-intro')).toBeInTheDocument();
    expect(screen.getByTestId('pension-status')).toBeInTheDocument();
    expect(screen.getByTestId('pension-detail-type')).toBeInTheDocument();
    expect(screen.getByTestId('pension-detail-linked')).toBeInTheDocument();
    expect(screen.getByTestId('warnings')).toBeInTheDocument();
  });

  it('does not render the pension status if not received', () => {
    render(
      <PensionDetailSummary data={{ ...mockData, pensionStatus: undefined }} />,
    );
    expect(screen.queryByTestId('pension-status')).not.toBeInTheDocument();
  });

  it('does not render the pension type if not received', () => {
    render(
      <PensionDetailSummary data={{ ...mockData, pensionType: undefined }} />,
    );
    expect(screen.queryByTestId('pension-detail-type')).not.toBeInTheDocument();
  });

  it('does not render linked pensions when there are none', () => {
    const { queryByTestId } = render(
      <PensionDetailSummary data={{ ...mockData, linkedPensions: [] }} />,
    );

    expect(queryByTestId('pension-detail-linked')).not.toBeInTheDocument();
  });

  it('renders the value illustration date accordion when summary values are available', () => {
    render(
      <PensionDetailSummary
        data={{
          ...mockData,
          matchType: MatchType.DEFN,
          detailData: {
            ...mockData.detailData,
            standardPayment: {
              monthlyAmount: 100,
              payableDate: '2051-04-01',
              benefitType: BenefitType.DC,
              hasAnyValues: true,
            },
          },
        }}
      />,
    );

    expect(
      screen.getByTestId('value-illustration-date-accordion'),
    ).toHaveTextContent(
      'pages.pension-details.value-illustration-date.summary.title',
    );
  });

  it('does not render the value illustration date accordion when the summary value is unavailable', () => {
    render(
      <PensionDetailSummary
        data={{
          ...mockData,
          matchType: MatchType.DEFN,
          detailData: {
            ...mockData.detailData,
            standardPayment: undefined,
          },
        }}
      />,
    );

    expect(
      screen.queryByTestId('value-illustration-date-accordion'),
    ).not.toBeInTheDocument();
  });

  it('renders the value illustration date accordion for a cash balance lump sum', () => {
    render(
      <PensionDetailSummary
        data={{
          ...mockData,
          matchType: MatchType.DEFN,
          pensionType: PensionType.CB,
          detailData: {
            ...mockData.detailData,
            standardPayment: {
              lumpSumAmount: 10000,
              lumpSumPayableDate: '2051-04-01',
              benefitType: BenefitType.CBL,
              hasAnyValues: true,
            },
          },
        }}
      />,
    );

    expect(
      screen.getByTestId('value-illustration-date-accordion'),
    ).toBeInTheDocument();
  });

  it('suppresses the value illustration date accordion for SYS or NEW matches', () => {
    render(
      <PensionDetailSummary
        data={{
          ...mockData,
          matchType: MatchType.SYS,
          detailData: {
            ...mockData.detailData,
            standardPayment: {
              monthlyAmount: 100,
              payableDate: '2051-04-01',
              benefitType: BenefitType.DC,
              hasAnyValues: true,
            },
          },
        }}
      />,
    );

    expect(
      screen.queryByTestId('value-illustration-date-accordion'),
    ).not.toBeInTheDocument();
  });
});
