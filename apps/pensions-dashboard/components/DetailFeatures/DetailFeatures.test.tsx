import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { IllustrationWarning } from '../../lib/constants';
import { BenefitIllustration, RecurringIncomeDetails } from '../../lib/types';
import { DetailFeatures } from './DetailFeatures';

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
    render(<DetailFeatures illustration={null} />);
    expect(screen.queryByTestId('features')).not.toBeInTheDocument();
  });

  it('renders null when no features are present', () => {
    const illustration = {
      illustrationComponents: [{}],
    } as BenefitIllustration;

    render(<DetailFeatures illustration={illustration} />);
    expect(screen.queryByTestId('features')).not.toBeInTheDocument();
  });

  it('renders features when all conditions are met', () => {
    const illustration = {
      illustrationComponents: [
        {
          payableDetails: {
            increasing: true,
          } as RecurringIncomeDetails,
          illustrationWarnings: [IllustrationWarning.UNP],
          safeguardedBenefit: true,
        },
      ],
    } as BenefitIllustration;

    render(<DetailFeatures illustration={illustration} />);
    expect(screen.getByTestId('features')).toBeInTheDocument();
    expect(screen.getByText('data.pensions.increasing')).toBeInTheDocument();
    expect(
      screen.getByText('data.pensions.warnings.UNP-description'),
    ).toBeInTheDocument();
    expect(screen.getByText('data.pensions.safeguarded')).toBeInTheDocument();
  });
});
