import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { IllustrationWarning } from '../../lib/constants';
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

  it('does not render linked pensions when there are none', () => {
    const { queryByTestId } = render(
      <PensionDetailSummary data={{ ...mockData, linkedPensions: [] }} />,
    );

    expect(queryByTestId('pension-detail-linked')).not.toBeInTheDocument();
  });
});
