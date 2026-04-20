import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { IllustrationWarning } from '../../lib/constants';
import { mockPensionDetailsDB } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PensionDetailSummaryWarnings } from './PensionDetailSummaryWarnings';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockData = {
  ...mockPensionDetailsDB,
  detailData: {
    warnings: [
      IllustrationWarning.PSO,
      IllustrationWarning.PEO,
      IllustrationWarning.FAS,
      IllustrationWarning.PNR,
      IllustrationWarning.SCP,
    ],
  },
} as PensionArrangement;

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

  it.each`
    warning  | title                                 | description
    ${'PSO'} | ${'data.pensions.warnings.PSO-title'} | ${'data.pensions.warnings.PSO-description'}
    ${'PEO'} | ${'data.pensions.warnings.PEO-title'} | ${'data.pensions.warnings.PEO-description'}
    ${'FAS'} | ${'data.pensions.warnings.FAS-title'} | ${'data.pensions.warnings.FAS-description'}
    ${'PNR'} | ${'data.pensions.warnings.PNR-title'} | ${'data.pensions.warnings.PNR-description'}
    ${'SCP'} | ${'data.pensions.warnings.SCP-title'} | ${'data.pensions.warnings.SCP-description'}
  `(
    'should render warning callout for illustration warning $warning',
    ({ warning, title, description }) => {
      render(<PensionDetailSummaryWarnings data={mockData} />);
      expect(screen.getByTestId('warnings')).toBeInTheDocument();
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

  it('should render warning callout for pension type of DB with AVC benefit', () => {
    const dataDBWithAVC = {
      ...mockPensionDetailsDB,
      hasMultipleTranches: true,
      benefitIllustrations: [
        {
          illustrationComponents: [
            {
              benefitType: 'AVC',
            },
          ],
        },
      ],
    } as PensionArrangement;
    render(<PensionDetailSummaryWarnings data={dataDBWithAVC} />);
    expect(
      screen.getByTestId('callout-default-warning-DBAVC'),
    ).toBeInTheDocument();
    expect(screen.getByTestId(`warning-title-DBAVC`)).toHaveTextContent(
      'data.pensions.warnings.DBAVC-title',
    );
    expect(screen.getByTestId(`warning-description-DBAVC`)).toHaveTextContent(
      'data.pensions.warnings.DBAVC-description',
    );
  });

  it('should filter out warnings that are not in the warningsToFind list', () => {
    const unwantedWarnings = {
      ...mockPensionDetailsDB,
      detailData: {
        warnings: [IllustrationWarning.TVI, IllustrationWarning.FAS],
      },
    } as PensionArrangement;

    render(<PensionDetailSummaryWarnings data={unwantedWarnings} />);

    expect(
      screen.queryByTestId('callout-default-warning-TVI'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('callout-default-warning-FAS'),
    ).toBeInTheDocument();
  });

  it('should deduplicate warnings when the same warning appears multiple times', () => {
    const duplicateWarnings = {
      ...mockPensionDetailsDB,
      detailData: {
        warnings: [IllustrationWarning.PSO, IllustrationWarning.PSO],
      },
    } as PensionArrangement;

    render(<PensionDetailSummaryWarnings data={duplicateWarnings} />);

    const warnings = screen.getAllByTestId(
      `callout-default-warning-${IllustrationWarning.PSO}`,
    );
    expect(warnings).toHaveLength(1);
  });

  it('should return null when warnings array is undefined', () => {
    const data = {
      ...mockPensionDetailsDB,
    } as PensionArrangement;

    render(<PensionDetailSummaryWarnings data={data} />);
    expect(screen.queryByTestId('warnings')).not.toBeInTheDocument();
  });

  it('should return null when warnings array is empty', () => {
    const data = {
      ...mockPensionDetailsDB,
      detailData: { warnings: [] },
    } as PensionArrangement;
    render(<PensionDetailSummaryWarnings data={data} />);
    expect(screen.queryByTestId('warnings')).not.toBeInTheDocument();
  });
});
