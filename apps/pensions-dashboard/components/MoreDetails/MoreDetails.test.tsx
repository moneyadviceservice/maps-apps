import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { IllustrationWarning } from '../../lib/constants';
import { BenefitIllustration } from '../../lib/types';
import { MoreDetails } from './MoreDetails';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

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
    render(<MoreDetails illustration={null} />);
    expect(screen.queryByTestId('more-details')).not.toBeInTheDocument();
  });

  it('returns null when no warnings or survivor benefits are found', () => {
    const illustration = {
      illustrationComponents: [{}],
    } as BenefitIllustration;

    render(<MoreDetails illustration={illustration} />);
    expect(screen.queryByTestId('more-details')).not.toBeInTheDocument();
  });

  it('renders warnings when present', () => {
    const illustration = {
      illustrationComponents: [
        {
          illustrationWarnings: [
            IllustrationWarning.CUR,
            IllustrationWarning.DEF,
            IllustrationWarning.TVI,
          ],
          survivorBenefit: true,
        },
      ],
    } as BenefitIllustration;

    render(<MoreDetails illustration={illustration} />);

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
      illustrationComponents: [
        {
          illustrationWarnings: [IllustrationWarning.CUR],
          survivorBenefit: false,
        },
        {
          illustrationWarnings: [IllustrationWarning.DEF],
          survivorBenefit: true,
        },
      ],
    } as BenefitIllustration;

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
