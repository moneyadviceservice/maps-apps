import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { CalculationMethod, PensionType } from '../../lib/constants';
import { BenefitIllustration } from '../../lib/types';
import { EstimateCalculationAccordion } from './EstimateCalculationAccordion';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

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

  const mockIllustrationWithSMPI: BenefitIllustration = {
    illustrationComponents: [{ calculationMethod: CalculationMethod.SMPI }],
  } as BenefitIllustration;

  const mockIllustrationWithBS: BenefitIllustration = {
    illustrationComponents: [{ calculationMethod: CalculationMethod.BS }],
  } as BenefitIllustration;

  const mockIllustrationWithoutMethod: BenefitIllustration = {
    illustrationComponents: [{ calculationMethod: CalculationMethod.CBI }],
  } as BenefitIllustration;

  it('renders the accordion with correct title', () => {
    render(
      <EstimateCalculationAccordion
        illustration={mockIllustrationWithSMPI}
        pensionType={PensionType.DC}
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
    ${'AVC no illustration'}   | ${PensionType.AVC} | ${null}                          | ${'common.unavailable'}
    ${'DC with SMPI'}          | ${PensionType.DC}  | ${mockIllustrationWithSMPI}      | ${'pages.pension-details.information.how-estimate-is-calculated.dc'}
    ${'DC wrong calc method'}  | ${PensionType.DC}  | ${mockIllustrationWithoutMethod} | ${'common.unavailable'}
    ${'DC no illustration'}    | ${PensionType.DC}  | ${null}                          | ${'common.unavailable'}
    ${'DB with BS'}            | ${PensionType.DB}  | ${mockIllustrationWithBS}        | ${'pages.pension-details.information.how-estimate-is-calculated.db'}
    ${'DB wrong calc method'}  | ${PensionType.DB}  | ${mockIllustrationWithoutMethod} | ${'common.unavailable'}
    ${'DB no illustration'}    | ${PensionType.DB}  | ${null}                          | ${'common.unavailable'}
  `('$description', ({ pensionType, illustration, content }) => {
    render(
      <EstimateCalculationAccordion
        illustration={illustration}
        pensionType={pensionType}
      />,
    );
    expect(screen.getByTestId('calculation-content')).toHaveTextContent(
      content,
    );
  });
});
