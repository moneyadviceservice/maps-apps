import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { MatchType, PensionType } from '../../lib/constants';
import {
  mockAVC,
  mockCB,
  mockCDC,
  mockHybrid,
  mockMcCloud,
  mockPensionDetailsDBRecurring,
  mockPensionDetailsDCRecurring,
  mockPensionsData,
} from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PensionDetailIncomeValues } from './PensionDetailIncomeValues';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockPensionData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

const mockDBData = mockPensionDetailsDBRecurring as PensionArrangement;
const mockDCData = mockPensionDetailsDCRecurring as PensionArrangement;

const mockAVCData = mockAVC as PensionArrangement;

const mockHybridDC = mockHybrid[0] as PensionArrangement;
const mockHybridDB = mockHybrid[1] as PensionArrangement;
const mockCDCData = mockCDC as PensionArrangement;
const mockMcCloudData = mockMcCloud as PensionArrangement;
const mockCBData = mockCB as PensionArrangement;

const HYBandAVCData = {
  ...mockHybridDB,
  benefitIllustrations: [
    ...(mockHybridDB.benefitIllustrations || []),
    ...(mockAVCData.benefitIllustrations || []),
  ],
};

describe('PensionDetailIncomeValues', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: (key: string) => [key],
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
    ${PensionType.CDC} | ${mockCDCData}
    ${PensionType.CB}  | ${mockCBData}
  `('renders the component for $type pension type', ({ data }) => {
    render(<PensionDetailIncomeValues data={data} />);
    expect(screen.getByTestId('heading')).toBeInTheDocument();
    expect(screen.getByTestId('sub-heading')).toBeInTheDocument();
    expect(screen.getByTestId('bar-charts')).toBeInTheDocument();
    expect(screen.getByTestId('donut-charts')).toBeInTheDocument();
    expect(screen.queryByTestId('mccloud-heading')).not.toBeInTheDocument();
  });

  it('renders the value illustration date accordion when charts have values', () => {
    render(<PensionDetailIncomeValues data={mockDBData} />);

    expect(
      screen.getByTestId('value-illustration-date-accordion'),
    ).toHaveTextContent(
      'pages.pension-details.value-illustration-date.income-and-values.title',
    );
  });

  it('renders the value illustration date accordion when there is one payable year', () => {
    render(<PensionDetailIncomeValues data={mockDCData} />);

    expect(
      screen.getByTestId('value-illustration-date-accordion'),
    ).toBeInTheDocument();
  });

  it('renders headings when illustration is a McCloud illustration', () => {
    render(<PensionDetailIncomeValues data={mockMcCloudData} />);
    const mcCloudHeading = screen.getAllByTestId('mccloud-heading');
    expect(mcCloudHeading).toHaveLength(2);
    expect(mcCloudHeading[0]).toHaveTextContent(
      `components.income-timeline.legacy components.income-timeline.option`,
    );
    expect(mcCloudHeading[1]).toHaveTextContent(
      `components.income-timeline.alternative components.income-timeline.option`,
    );
  });

  it('renders benefit type title when there is a Hybrid pension type', () => {
    render(<PensionDetailIncomeValues data={mockHybridDC} />);
    const benefitTypeTitle = screen.getByTestId('benefit-type-title-dc');
    expect(benefitTypeTitle).toHaveTextContent(
      'pages.pension-details.chart-sections.DC',
    );
  });

  it('renders benefit type title when there are multiple benefit types', () => {
    render(<PensionDetailIncomeValues data={HYBandAVCData} />);
    expect(screen.getByTestId('benefit-type-title-db')).toHaveTextContent(
      'pages.pension-details.chart-sections.DB',
    );
    expect(screen.getByTestId('benefit-type-title-avc')).toHaveTextContent(
      'pages.pension-details.chart-sections.AVC',
    );
  });

  it('renders warning text for SYS or NEW matches with benefit values', () => {
    render(
      <PensionDetailIncomeValues
        data={{
          ...mockDBData,
          matchType: MatchType.SYS,
        }}
      />,
    );

    expect(screen.getByTestId('sub-heading')).toHaveTextContent(
      'pages.pension-details.headings.income-and-values-sub',
    );
    expect(screen.getByTestId('sys-new-values-warning')).toHaveTextContent(
      'pages.pension-details.headings.income-and-values-warning',
    );
    expect(
      screen.getByTestId('value-illustration-date-accordion'),
    ).toBeInTheDocument();
  });

  it('renders provider data issue text for SYS or NEW matches without benefit values', () => {
    render(
      <PensionDetailIncomeValues
        data={{
          ...mockPensionData,
          matchType: MatchType.NEW,
          pensionType: undefined,
          benefitIllustrations: undefined,
        }}
      />,
    );

    expect(
      screen.getByTestId('sys-new-no-benefit-type-message'),
    ).toHaveTextContent('data/unavailable-reasons.NEW_MATCHTYPE');
    expect(screen.queryByTestId('sub-heading')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('value-illustration-date-accordion'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('bar-charts')).not.toBeInTheDocument();
    expect(screen.queryByTestId('donut-charts')).not.toBeInTheDocument();
  });

  it('renders DC sub heading text if DC chart is shown', () => {
    render(<PensionDetailIncomeValues data={mockPensionData} />);

    expect(screen.getByTestId('sub-heading-dc')).toHaveTextContent(
      'income-and-values-sub-dc',
    );
  });
});
