import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { IllustrationWarning } from '../../lib/constants';
import { BenefitIllustration } from '../../lib/types';
import { PensionDetailSummaryWarnings } from './PensionDetailSummaryWarnings';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockIllustration: BenefitIllustration = {
  illustrationComponents: [
    {
      illustrationWarnings: [
        IllustrationWarning.PSO,
        IllustrationWarning.PEO,
        IllustrationWarning.FAS,
      ],
    },
    {
      illustrationWarnings: [IllustrationWarning.PNR, IllustrationWarning.SCP],
    },
  ],
} as BenefitIllustration;
describe('PensionDetailSummaryWarnings', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render warnings container when illustration has warnings', () => {
    render(<PensionDetailSummaryWarnings illustration={mockIllustration} />);
    expect(screen.getByTestId('warnings')).toBeInTheDocument();
  });

  it.each`
    warning                    | title                                 | description
    ${IllustrationWarning.PSO} | ${'data.pensions.warnings.PSO-title'} | ${'data.pensions.warnings.PSO-description'}
    ${IllustrationWarning.PEO} | ${'data.pensions.warnings.PEO-title'} | ${'data.pensions.warnings.PEO-description'}
    ${IllustrationWarning.FAS} | ${'data.pensions.warnings.FAS-title'} | ${'data.pensions.warnings.FAS-description'}
    ${IllustrationWarning.PNR} | ${'data.pensions.warnings.PNR-title'} | ${'data.pensions.warnings.PNR-description'}
    ${IllustrationWarning.SCP} | ${'data.pensions.warnings.SCP-title'} | ${'data.pensions.warnings.SCP-description'}
  `(
    'should render warning callout for %s',
    ({ warning, title, description }) => {
      render(<PensionDetailSummaryWarnings illustration={mockIllustration} />);
      expect(
        screen.getByTestId(`callout-default-warning-${warning}`),
      ).toBeInTheDocument();
      expect(screen.getByTestId(`warning-title-${warning}`)).toHaveTextContent(
        title,
      );
      expect(
        screen.getByTestId(`warning-description-${warning}`),
      ).toHaveTextContent(description);
    },
  );

  it('should filter out warnings that are not in the warningsToFind list', () => {
    const unwantedWarning: BenefitIllustration = {
      illustrationComponents: [
        {
          illustrationWarnings: [
            IllustrationWarning.TVI,
            IllustrationWarning.FAS,
          ],
        },
      ],
    } as BenefitIllustration;

    render(<PensionDetailSummaryWarnings illustration={unwantedWarning} />);

    expect(
      screen.queryByTestId('callout-default-warning-TVI'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('callout-default-warning-FAS'),
    ).toBeInTheDocument();
  });

  it('should deduplicate warnings when the same warning appears multiple times', () => {
    const duplicateWarnings: BenefitIllustration = {
      illustrationComponents: [
        {
          illustrationWarnings: [IllustrationWarning.PSO],
        },
        {
          illustrationWarnings: [IllustrationWarning.PSO],
        },
      ],
    } as BenefitIllustration;

    render(<PensionDetailSummaryWarnings illustration={duplicateWarnings} />);

    const warnings = screen.getAllByTestId(
      `callout-default-warning-${IllustrationWarning.PSO}`,
    );
    expect(warnings).toHaveLength(1);
  });

  it('should return null when there are no illustrations', () => {
    render(<PensionDetailSummaryWarnings illustration={null} />);
    expect(screen.queryByTestId('warnings')).not.toBeInTheDocument();
  });

  it('should return null when there are no warnings', () => {
    const noWarnings: BenefitIllustration = {
      illustrationComponents: [{}],
    } as BenefitIllustration;
    render(<PensionDetailSummaryWarnings illustration={noWarnings} />);
    expect(screen.queryByTestId('warnings')).not.toBeInTheDocument();
  });
});
