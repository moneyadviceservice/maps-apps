import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import {
  BenefitType,
  CalculationMethod,
  IllustrationType,
  RecurringAmountType,
} from '../../lib/constants';
import { mockPensionDetailsSP } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { StatePensionEstimatedIncome } from './StatePensionEstimatedIncome';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockData = mockPensionDetailsSP as PensionArrangement;

const mockDataNoERI = {
  ...mockData,
  benefitIllustrations: [
    // Missing ERI
    {
      illustrationDate: '2024-08-24',
      illustrationComponents: [
        {
          benefitType: BenefitType.SP,
          payableDetails: {
            amountType: RecurringAmountType.INC,
            payableDate: '2042-02-23',
            annualAmount: 11502,
            monthlyAmount: 958.5,
            increasing: true,
          },
          illustrationType: IllustrationType.AP,
          calculationMethod: CalculationMethod.BS,
        },
      ],
    },
  ],
};

const mockDataNoAP = {
  ...mockData,
  benefitIllustrations: [
    {
      illustrationDate: '2024-08-24',
      illustrationComponents: [
        {
          benefitType: BenefitType.SP,
          payableDetails: {
            amountType: RecurringAmountType.INC,
            payableDate: '2042-02-23',
            annualAmount: 11502,
            monthlyAmount: 958.5,
            increasing: true,
          },
          illustrationType: IllustrationType.ERI,
          calculationMethod: CalculationMethod.BS,
        },
      ],
    },
    // Missing AP
  ],
};

describe('StatePensionEstimatedIncome', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  it('renders correctly', () => {
    const { container } = render(
      <StatePensionEstimatedIncome data={mockData} />,
    );
    expect(container).toMatchSnapshot();
  });

  it.each`
    description                               | testData
    ${'no benefit illustrations are present'} | ${{ ...mockData, benefitIllustrations: [] }}
    ${'monthly AP is missing'}                | ${mockDataNoAP}
    ${'monthly ERI is missing'}               | ${mockDataNoERI}
  `('does not render when $description', ({ testData }) => {
    const { container } = render(
      <StatePensionEstimatedIncome data={testData} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
