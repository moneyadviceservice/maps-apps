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
          benefitType: 'DC',
          calculationMethod: 'SMPI',
          survivorBenefit: false,
          dcPot: 311011,
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
          amountType: 'INC',
          calculationMethod: 'SMPI',
          dcPot: 311011,
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
    expect(screen.getByTestId('warnings')).toBeInTheDocument();
  });
});
