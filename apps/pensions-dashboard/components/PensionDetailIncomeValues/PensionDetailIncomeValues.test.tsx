import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PayableDetailsType, PensionType } from '../../lib/constants';
import {
  mockAVC,
  mockHybrid,
  mockPensionDetailsDBRecurring,
  mockPensionsData,
} from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PensionDetailIncomeValues } from './PensionDetailIncomeValues';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockPensionData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

const mockDBData = mockPensionDetailsDBRecurring as PensionArrangement;

const mockAVCData = mockAVC as PensionArrangement;

const mockHybridDC = mockHybrid[0] as PensionArrangement;
const mockHybridDB = mockHybrid[1] as PensionArrangement;

const mockDBBenefitIllustration = {
  illustrationDate: '2025-09-05',
  payableDetailsType: PayableDetailsType.RECURRING,
  illustrationComponents: [
    {
      illustrationType: 'ERI',
      survivorBenefit: true,
      safeguardedBenefit: true,
      benefitType: 'DB',
      calculationMethod: 'BS',
      payableDetails: {
        amountType: 'INC',
        annualAmount: 31678,
        payableDate: '2040-10-23',
        increasing: true,
        monthlyAmount: 2639.83,
      },
      illustrationWarnings: ['UNP'],
    },
    {
      illustrationType: 'AP',
      benefitType: 'DB',
      calculationMethod: 'BS',
      survivorBenefit: false,
      safeguardedBenefit: false,
      payableDetails: {
        amountType: 'INC',
        annualAmount: 23997,
        payableDate: '2040-10-23',
        monthlyAmount: 1999.75,
      },
    },
  ],
};

describe('PensionDetailIncomeValues', () => {
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
    type               | data
    ${PensionType.DB}  | ${mockDBData}
    ${PensionType.DC}  | ${mockPensionData}
    ${PensionType.AVC} | ${mockAVCData}
    ${PensionType.HYB} | ${mockHybridDC}
    ${PensionType.HYB} | ${mockHybridDB}
  `('renders the component for $type pension type', ({ data }) => {
    render(<PensionDetailIncomeValues data={data} />);
    expect(screen.getByTestId('heading')).toBeInTheDocument();
    expect(screen.getByTestId('sub-heading')).toBeInTheDocument();
    expect(screen.getByTestId('bar-charts')).toBeInTheDocument();
    expect(screen.getByTestId('donut-charts')).toBeInTheDocument();
  });

  it.each`
    type               | data
    ${PensionType.DC}  | ${mockPensionData}
    ${PensionType.AVC} | ${mockAVCData}
    ${PensionType.HYB} | ${mockHybridDC}
  `(
    'renders accordions for pension type $type (DC) pension types',
    ({ data }) => {
      render(<PensionDetailIncomeValues data={data} />);
      const dcAccordions = screen.queryAllByTestId('dc-calculation-accordion');
      const dcDonutAccordions = screen.queryAllByTestId(
        'dc-calculation-accordion-donut',
      );
      const dcMoreDetails = screen.queryAllByTestId('more-details');
      const dcDonutMoreDetails = screen.queryAllByTestId('more-details-donut');
      const dcFeatures = screen.queryAllByTestId('features');
      const dcDonutFeatures = screen.queryAllByTestId('features-donut');
      expect(dcAccordions.length).toBe(1);
      expect(dcDonutAccordions.length).toBe(1);
      expect(dcMoreDetails.length).toBe(1);
      expect(dcDonutMoreDetails.length).toBe(1);
      expect(dcFeatures.length).toBe(1);
      expect(dcDonutFeatures.length).toBe(1);
      expect(
        screen.queryByTestId('db-calculation-accordion'),
      ).not.toBeInTheDocument();
    },
  );

  it.each`
    type               | data
    ${PensionType.DB}  | ${{ ...mockPensionData, pensionType: PensionType.DB, benefitIllustrations: [mockDBBenefitIllustration] }}
    ${PensionType.HYB} | ${{ ...mockHybridDB, benefitIllustrations: [mockDBBenefitIllustration] }}
  `(
    'renders accordions for pension type $type (DB) pension types',
    ({ data }) => {
      render(<PensionDetailIncomeValues data={data} />);
      expect(
        screen.getByTestId('db-calculation-accordion'),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('dc-calculation-accordion'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('more-details')).toBeInTheDocument();
      expect(screen.getByTestId('features')).toBeInTheDocument();
    },
  );
});
