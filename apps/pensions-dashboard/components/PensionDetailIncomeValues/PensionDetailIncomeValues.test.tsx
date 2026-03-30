import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { BenefitType, PensionType } from '../../lib/constants';
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
  `(
    'renders accordions for pension type $type (DC) pension types',
    ({ data }) => {
      render(<PensionDetailIncomeValues data={data} />);
      expect(
        screen.getByTestId('dc-calculation-accordion'),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('db-calculation-accordion'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('more-details')).toBeInTheDocument();
      expect(screen.getByTestId('features')).toBeInTheDocument();
    },
  );

  it.each`
    type | data
    ${PensionType.DB} | ${{ ...mockPensionData, pensionType: PensionType.DB, detailData: {
    ...mockPensionData.detailData,
    benefitType: 'DB',
    incomeAndValues: [{
        ...mockPensionData.detailData?.incomeAndValues?.[0],
        bar: {
          ...mockPensionData.detailData?.incomeAndValues?.[0].bar,
          eri: {
            ...mockPensionData.detailData?.incomeAndValues?.[0].bar.eri,
            benefitType: 'DB',
          },
          ap: {
            ...mockPensionData.detailData?.incomeAndValues?.[0].bar.ap,
            benefitType: 'DB',
          },
        },
        donut: undefined,
      }],
  } }}
    ${PensionType.HYB} | ${{ ...mockHybridDB, detailData: {
    ...mockHybridDB.detailData,
    incomeAndValues: [{
        ...mockHybridDB.detailData?.incomeAndValues?.[0],
        donut: undefined,
      }],
  } }}
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

  it('renders accordions for DB and HYB DB pension types', () => {
    render(
      <PensionDetailIncomeValues
        data={
          {
            ...mockPensionData,
            pensionType: PensionType.DB,
            detailData: {
              ...mockPensionData.detailData,
              benefitType: BenefitType.DB,
              incomeAndValues: [
                {
                  ...mockPensionData.detailData?.incomeAndValues?.[0],
                  bar: {
                    ...mockPensionData.detailData?.incomeAndValues?.[0].bar,
                    eri: {
                      ...mockPensionData.detailData?.incomeAndValues?.[0].bar
                        .eri,
                      benefitType: BenefitType.DB,
                    },
                    ap: {
                      ...mockPensionData.detailData?.incomeAndValues?.[0].bar
                        .ap,
                      benefitType: BenefitType.DB,
                    },
                  },
                  donut: undefined,
                },
              ],
            },
          } as PensionArrangement
        }
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
