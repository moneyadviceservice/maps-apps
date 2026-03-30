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

  const mockIllustrationWithoutMethod = {
    ...mockIllustrationWithSMPI,
    eri: {
      ...mockIllustrationWithSMPI.eri,
      calculationMethod: CalculationMethod.CBI,
    },
    ap: {
      ...mockIllustrationWithSMPI.ap,
      calculationMethod: CalculationMethod.CBI,
    },
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
    desc                       | pensionType        | illustration                     | content
    ${'AVC with SMPI'}         | ${PensionType.AVC} | ${mockIllustrationWithSMPI}      | ${'pages.pension-details.information.how-estimate-is-calculated.avc'}
    ${'AVC wrong calc method'} | ${PensionType.AVC} | ${mockIllustrationWithoutMethod} | ${'common.unavailable'}
    ${'DC with SMPI'}          | ${PensionType.DC}  | ${mockIllustrationWithSMPI}      | ${'pages.pension-details.information.how-estimate-is-calculated.dc'}
    ${'DC wrong calc method'}  | ${PensionType.DC}  | ${mockIllustrationWithoutMethod} | ${'common.unavailable'}
    ${'DB with BS'}            | ${PensionType.DB}  | ${mockIllustrationWithBS}        | ${'pages.pension-details.information.how-estimate-is-calculated.db'}
    ${'DB wrong calc method'}  | ${PensionType.DB}  | ${mockIllustrationWithoutMethod} | ${'common.unavailable'}
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
