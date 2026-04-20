import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { mockChartIllustration } from '../../lib/mocks';
import { ChartIllustration } from '../../lib/types';
import { MoreDetails } from './MoreDetails';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockIllustration = {
  ...mockChartIllustration,
  eri: {
    ...mockChartIllustration.eri,
    survivorBenefit: true,
    warnings: ['CUR', 'FAS', 'PNR', 'DEF', 'PSO', 'TVI'],
  },
  ap: {
    ...mockChartIllustration.ap,
    survivorBenefit: false,
    warnings: ['TVI', 'FAS', 'CUR', 'PEO', 'SCP', 'DEF'],
  },
} as ChartIllustration;

describe('MoreDetails', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when illustration is null', () => {
    render(<MoreDetails illustration={undefined} />);
    expect(screen.queryByTestId('more-details')).not.toBeInTheDocument();
  });

  it('returns null when no warnings or survivor benefits are found', () => {
    const illustration = {
      ...mockIllustration,
      eri: {
        ...mockIllustration.eri,
        survivorBenefit: false,
        safeguardedBenefit: false,
        warnings: [],
      },
      ap: {
        ...mockIllustration.ap,
        survivorBenefit: false,
        safeguardedBenefit: false,
        warnings: [],
      },
    };

    render(<MoreDetails illustration={illustration} />);
    expect(screen.queryByTestId('more-details')).not.toBeInTheDocument();
  });

  it('renders all items once and in correct order', () => {
    render(<MoreDetails illustration={mockIllustration} />);

    const items = screen
      .getAllByRole('listitem')
      .map((item) => item.textContent);

    expect(items).toEqual([
      'data.pensions.warnings.PSO-title',
      'data.pensions.warnings.PEO-title',
      'data.pensions.warnings.PNR-title',
      'data.pensions.warnings.SCP-title',
      'data.pensions.warnings.FAS-title-benefit',
      'data.pensions.warnings.CUR-description',
      'data.pensions.warnings.DEF-description',
      'data.pensions.warnings.TVI-description',
      'data.pensions.survivor-benefit',
    ]);
  });
});
