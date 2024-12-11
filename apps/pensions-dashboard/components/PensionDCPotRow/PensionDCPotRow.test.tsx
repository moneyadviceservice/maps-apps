import { render } from '@testing-library/react';

import {
  BenefitType,
  CalculationMethod,
  IllustrationType,
} from '../../lib/constants';
import { mockPensionsData } from '../../lib/mocks';
import { BenefitIllustration, RecurringIncomeDetails } from '../../lib/types';
import { PensionDCPotRow } from './PensionDCPotRow';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation', () => () => ({
  t: (key: string) => key,
}));

const mockData = mockPensionsData.pensionPolicies[0].pensionArrangements[0]
  .benefitIllustrations as BenefitIllustration[];

const mockDataWithNoDcPot: BenefitIllustration[] = [
  {
    illustrationComponents: [
      {
        dcPot: undefined,
        benefitType: BenefitType.SP,
        calculationMethod: CalculationMethod.BS,
        illustrationType: IllustrationType.ERI,
        payableDetails: {} as RecurringIncomeDetails,
      },
      {
        dcPot: undefined,
        benefitType: BenefitType.SP,
        calculationMethod: CalculationMethod.BS,
        illustrationType: IllustrationType.ERI,
        payableDetails: {} as RecurringIncomeDetails,
      },
    ],
    illustrationDate: '2023-01-01',
  },
];

describe('PensionDCPotRow', () => {
  it('renders correctly', () => {
    const { container } = render(<PensionDCPotRow data={mockData} />);
    expect(container).toMatchSnapshot();
  });

  it('returns null when there is no data', () => {
    const { container } = render(<PensionDCPotRow data={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly when there are dcPot values', () => {
    const { getByText, queryAllByText } = render(
      <PensionDCPotRow data={mockData} />,
    );
    expect(getByText('pages.pension-details.headings.pot')).toBeInTheDocument();
    expect(queryAllByText('£540,500').length).toBeGreaterThan(0);
  });

  it('renders null when there are no dcPot values', () => {
    const { container } = render(
      <PensionDCPotRow data={mockDataWithNoDcPot} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
