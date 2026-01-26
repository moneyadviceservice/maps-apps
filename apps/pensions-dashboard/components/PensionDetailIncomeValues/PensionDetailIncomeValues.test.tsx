import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionType } from '../../lib/constants';
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
  `('renders accordions for DC, AVC, and HYB DC pension types', ({ data }) => {
    render(<PensionDetailIncomeValues data={data} />);
    expect(screen.getByTestId('dc-calculation-accordion')).toBeInTheDocument();
    expect(
      screen.queryByTestId('db-calculation-accordion'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('more-details')).toBeInTheDocument();
    expect(screen.getByTestId('features')).toBeInTheDocument();
  });

  it.each`
    type              | data
    ${PensionType.DB} | ${{ ...mockPensionData, pensionType: PensionType.DB }}
    ${PensionType.HYB} | ${{ ...mockHybridDB, benefitIllustrations: [{
      illustrationDate: '2025-09-05',
      illustrationComponents: [{
          illustrationType: 'ERI',
          survivorBenefit: true,
          safeguardedBenefit: true,
          benefitType: 'DB',
          calculationMethod: 'SMPI',
          payableDetails: {
            amountType: 'INC',
            annualAmount: 31678,
            payableDate: '2040-10-23',
            increasing: true,
            monthlyAmount: 2639.83,
          },
          illustrationWarnings: ['UNP'],
        }, {
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
        }],
    }] }}
  `('renders accordions for DB and HYB DB pension types', ({ data }) => {
    render(<PensionDetailIncomeValues data={data} />);
    expect(screen.getByTestId('db-calculation-accordion')).toBeInTheDocument();
    expect(
      screen.queryByTestId('dc-calculation-accordion'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('more-details')).toBeInTheDocument();
    expect(screen.getByTestId('features')).toBeInTheDocument();
  });

  it('renders accordions for DB and HYB DB pension types', () => {
    render(
      <PensionDetailIncomeValues
        data={{ ...mockPensionData, pensionType: PensionType.DB }}
      />,
    );
    expect(screen.getByTestId('db-calculation-accordion')).toBeInTheDocument();
    expect(
      screen.queryByTestId('dc-calculation-accordion'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('more-details')).toBeInTheDocument();
    expect(screen.getByTestId('features')).toBeInTheDocument();
  });
});
