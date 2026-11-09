import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { CalculationMethod, PensionType } from '../../lib/constants';
import { ChartIllustration } from '../../lib/types';
import { EstimateCalculationAccordion } from './EstimateCalculationAccordion';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockIllustrationWithSMPI = {
  eri: {
    survivorBenefit: true,
    safeguardedBenefit: true,
    warnings: [],
    calculationMethod: CalculationMethod.SMPI,
    benefitType: 'DC',
  },
  ap: {
    safeguardedBenefit: false,
    survivorBenefit: false,
    warnings: [],
    calculationMethod: CalculationMethod.SMPI,
    benefitType: 'DC',
  },
} as ChartIllustration;

describe('EstimateCalculationAccordion', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockIllustrationWithBS = {
    ...mockIllustrationWithSMPI,
    eri: {
      ...mockIllustrationWithSMPI.eri,
      calculationMethod: CalculationMethod.BS,
    },
    ap: {
      ...mockIllustrationWithSMPI.ap,
      calculationMethod: CalculationMethod.BS,
    },
  } as ChartIllustration;

  const mockIllustrationWithCBI = {
    ...mockIllustrationWithSMPI,
    eri: {
      ...mockIllustrationWithSMPI.eri,
      calculationMethod: CalculationMethod.CBI,
    },
    ap: {
      ...mockIllustrationWithSMPI.ap,
      calculationMethod: CalculationMethod.BS,
    },
  } as ChartIllustration;

  const mockIllustrationWithoutMethod = {
    ...mockIllustrationWithSMPI,
    eri: {
      ...mockIllustrationWithSMPI.eri,
      calculationMethod: undefined,
    },
    ap: {
      ...mockIllustrationWithSMPI.ap,
      calculationMethod: undefined,
    },
  } as ChartIllustration;

  const mockCDIIllustration = {
    ...mockIllustrationWithBS,
    eri: { ...mockIllustrationWithoutMethod.eri, benefitType: 'CDI' },
  } as ChartIllustration;

  const mockCDLIllustration = {
    ...mockIllustrationWithBS,
    eri: { ...mockIllustrationWithoutMethod.eri, benefitType: 'CDL' },
  } as ChartIllustration;

  it('renders the accordion with correct title', () => {
    render(
      <EstimateCalculationAccordion
        illustration={mockIllustrationWithSMPI}
        calcType={PensionType.DC}
      />,
    );

    const summary = screen.getByText(
      'pages.pension-details.information.how-estimate-is-calculated.title',
    );
    expect(summary).toBeInTheDocument();
  });

  it.each`
    desc                           | pensionType        | illustration                     | content
    ${'AVC with SMPI'}             | ${PensionType.AVC} | ${mockIllustrationWithSMPI}      | ${'pages.pension-details.information.how-estimate-is-calculated.avc'}
    ${'AVC missing calc method'}   | ${PensionType.AVC} | ${mockIllustrationWithoutMethod} | ${'pages.pension-details.information.how-estimate-is-calculated.missing'}
    ${'DC with SMPI'}              | ${PensionType.DC}  | ${mockIllustrationWithSMPI}      | ${'pages.pension-details.information.how-estimate-is-calculated.dc'}
    ${'DC missing calc method'}    | ${PensionType.DC}  | ${mockIllustrationWithoutMethod} | ${'pages.pension-details.information.how-estimate-is-calculated.missing'}
    ${'DB with BS'}                | ${PensionType.DB}  | ${mockIllustrationWithBS}        | ${'pages.pension-details.information.how-estimate-is-calculated.db'}
    ${'DB missing calc method'}    | ${PensionType.DB}  | ${mockIllustrationWithoutMethod} | ${'pages.pension-details.information.how-estimate-is-calculated.missing'}
    ${'CDC no CDI or CDL '}        | ${PensionType.CDC} | ${mockIllustrationWithBS}        | ${'pages.pension-details.information.how-estimate-is-calculated.missing'}
    ${'CDC with benefit type CDI'} | ${PensionType.CDC} | ${mockCDIIllustration}           | ${'pages.pension-details.information.how-estimate-is-calculated.cdc'}
    ${'CDC with benefit type CDL'} | ${PensionType.CDC} | ${mockCDLIllustration}           | ${'pages.pension-details.information.how-estimate-is-calculated.cdc'}
    ${'CB with CBI'}               | ${PensionType.CB}  | ${mockIllustrationWithCBI}       | ${'pages.pension-details.information.how-estimate-is-calculated.cb'}
    ${'CB missing calc method'}    | ${PensionType.CB}  | ${mockIllustrationWithoutMethod} | ${'pages.pension-details.information.how-estimate-is-calculated.missing'}
  `('$description', ({ pensionType, illustration, content }) => {
    render(
      <EstimateCalculationAccordion
        illustration={illustration}
        calcType={pensionType}
      />,
    );
    expect(screen.getByTestId('calculation-content')).toHaveTextContent(
      content,
    );
  });
});
