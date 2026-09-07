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
    warning  | title                        | description
    ${'PSO'} | ${'data/warnings.PSO-title'} | ${'data/warnings.PSO-description'}
    ${'PEO'} | ${'data/warnings.PEO-title'} | ${'data/warnings.PEO-description'}
    ${'FAS'} | ${'data/warnings.FAS-title'} | ${'data/warnings.FAS-description'}
    ${'PNR'} | ${'data/warnings.PNR-title'} | ${'data/warnings.PNR-description'}
    ${'SCP'} | ${'data/warnings.SCP-title'} | ${'data/warnings.SCP-description'}
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
      'data/warnings.DBAVC-title',
    );
    expect(screen.getByTestId(`warning-description-DBAVC`)).toHaveTextContent(
      'data/warnings.DBAVC-description',
    );
  });

  it.each(['VAR', 'CDC'])(
    'should render warning callout for %s pension type',
    (pensionType) => {
      const dataWithPensionType = {
        ...mockPensionDetailsDB,
        pensionType,
      } as PensionArrangement;
      render(<PensionDetailSummaryWarnings data={dataWithPensionType} />);
      expect(
        screen.getByTestId(`callout-default-warning-${pensionType}`),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`warning-title-${pensionType}`),
      ).toHaveTextContent(`data/warnings.${pensionType}-title`);
      expect(
        screen.getByTestId(`warning-description-${pensionType}`),
      ).toHaveTextContent(`data/warnings.${pensionType}-description`);
    },
  );

  it('should render warning callout for pension arrangements with McCloud remedy', () => {
    const dataWithMcCloud = {
      ...mockPensionDetailsDB,
      hasMultipleIncomeOptions: true,
    } as PensionArrangement;
    render(<PensionDetailSummaryWarnings data={dataWithMcCloud} />);
    expect(
      screen.getByTestId('callout-default-warning-MCCLOUD'),
    ).toBeInTheDocument();
    expect(screen.getByTestId(`warning-title-MCCLOUD`)).toHaveTextContent(
      'data/warnings.MCCLOUD-title',
    );
    expect(screen.getByTestId(`warning-description-MCCLOUD`)).toHaveTextContent(
      'data/warnings.MCCLOUD-description',
    );
  });

  it('should render warning callout for CBL benefit type', () => {
    const dataCBWithCBL = {
      ...mockPensionDetailsDB,
      benefitIllustrations: [
        {
          illustrationComponents: [
            {
              benefitType: 'CBL',
            },
          ],
        },
      ],
    } as PensionArrangement;
    render(<PensionDetailSummaryWarnings data={dataCBWithCBL} />);
    expect(
      screen.getByTestId('callout-default-warning-CBLUMP'),
    ).toBeInTheDocument();
    expect(screen.getByTestId(`warning-title-CBLUMP`)).toHaveTextContent(
      'data/warnings.CBLUMP-title',
    );
    expect(screen.getByTestId(`warning-description-CBLUMP`)).toHaveTextContent(
      'data/warnings.CBLUMP-description',
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
