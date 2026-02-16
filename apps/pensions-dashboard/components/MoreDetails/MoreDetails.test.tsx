import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { ChartIllustration } from '../../lib/types';
import { MoreDetails } from './MoreDetails';

import '@testing-library/jest-dom/extend-expect';

import { mockChartIllustration } from '../../lib/mocks';

jest.mock('@maps-react/hooks/useTranslation');

const mockIllustration = {
  ...mockChartIllustration,
  eri: {
    ...mockChartIllustration.eri,
    survivorBenefit: true,
    warnings: ['CUR', 'DEF', 'TVI'],
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
    };

    render(<MoreDetails illustration={illustration} />);
    expect(screen.queryByTestId('more-details')).not.toBeInTheDocument();
  });

  it('renders warnings when present', () => {
    render(<MoreDetails illustration={mockIllustration} />);

    expect(screen.getByTestId('more-details')).toBeInTheDocument();
    expect(
      screen.getByText('data.pensions.warnings.CUR-description'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('data.pensions.warnings.DEF-description'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('data.pensions.warnings.TVI-description'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('data.pensions.survivor-benefit'),
    ).toBeInTheDocument();
  });

  it('handles multiple components with warnings', () => {
    const illustration = {
      ...mockIllustration,
      eri: {
        ...mockIllustration.eri,
        survivorBenefit: false,
        warnings: ['CUR', 'DEF'],
      },
      ap: {
        ...mockIllustration.ap,
        survivorBenefit: true,
        warnings: ['TVI'],
      },
    } as ChartIllustration;

    render(<MoreDetails illustration={illustration} />);

    expect(screen.getByTestId('more-details')).toBeInTheDocument();
    expect(
      screen.getByText('data.pensions.warnings.CUR-description'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('data.pensions.warnings.DEF-description'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('data.pensions.survivor-benefit'),
    ).toBeInTheDocument();
  });
});
