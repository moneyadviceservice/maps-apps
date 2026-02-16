import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { DetailFeatures } from './DetailFeatures';
import { mockChartIllustration } from '../../lib/mocks';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

describe('DetailFeatures', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders null when illustration is null', () => {
    render(<DetailFeatures illustration={undefined} />);
    expect(screen.queryByTestId('features')).not.toBeInTheDocument();
  });

  it('renders null when no features are present', () => {
    const illustration = {
      ...mockChartIllustration,
      eri: {
        ...mockChartIllustration.eri,
        increasing: false,
        warnings: [],
        safeguardedBenefit: false,
        survivorBenefit: false,
      },
    };

    render(<DetailFeatures illustration={illustration} />);
    expect(screen.queryByTestId('features')).not.toBeInTheDocument();
  });

  it('renders features when all conditions are met', () => {
    render(<DetailFeatures illustration={mockChartIllustration} />);
    expect(screen.getByTestId('features')).toBeInTheDocument();
    expect(screen.getByText('data.pensions.increasing')).toBeInTheDocument();
    expect(
      screen.getByText('data.pensions.warnings.UNP-description'),
    ).toBeInTheDocument();
    expect(screen.getByText('data.pensions.safeguarded')).toBeInTheDocument();
  });
});
