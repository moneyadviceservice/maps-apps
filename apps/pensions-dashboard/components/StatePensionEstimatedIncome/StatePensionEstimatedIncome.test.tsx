import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { mockPensionDetailsSP } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { StatePensionEstimatedIncome } from './StatePensionEstimatedIncome';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockData = mockPensionDetailsSP as PensionArrangement;

const mockDataNoERI = {
  ...mockData,
  // Missing ERI
  detailData: {
    ...mockData.detailData,
    incomeAndValues: mockData.detailData?.incomeAndValues?.map((item) => ({
      ...item,
      bar: item.bar ? (({ eri, ...rest }) => rest)(item.bar) : item.bar,
    })),
  },
};

const mockDataNoAP = {
  ...mockData,
  // Missing AP
  detailData: {
    ...mockData.detailData,
    incomeAndValues: mockData.detailData?.incomeAndValues?.map((item) => ({
      ...item,
      bar: item.bar ? (({ ap, ...rest }) => rest)(item.bar) : item.bar,
    })),
  },
};

const mockDataZeroValues = {
  ...mockData,
  detailData: {
    ...mockData.detailData,
    incomeAndValues: mockData.detailData?.incomeAndValues?.map((item) => ({
      ...item,
      bar: {
        ...item.bar,
        eri: {
          ...item.bar?.eri,
          monthlyAmount: 0,
          annualAmount: 0,
        },
        ap: {
          ...item.bar?.ap,
          monthlyAmount: 0,
          annualAmount: 0,
        },
      },
    })),
  },
} as PensionArrangement;

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

  it('renders zero values correctly', () => {
    const { container } = render(
      <StatePensionEstimatedIncome data={mockDataZeroValues} />,
    );
    expect(container).toMatchSnapshot();
  });

  it.each`
    description                               | testData
    ${'no benefit illustrations are present'} | ${{ ...mockData, benefitIllustrations: [], detailData: {} }}
    ${'monthly AP is missing'}                | ${mockDataNoAP}
    ${'monthly ERI is missing'}               | ${mockDataNoERI}
  `('does not render when $description', ({ testData }) => {
    const { container } = render(
      <StatePensionEstimatedIncome data={testData} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
