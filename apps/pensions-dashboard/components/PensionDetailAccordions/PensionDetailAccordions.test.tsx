import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionGroup, PensionType } from '../../lib/constants';
import { mockPensionsData } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PensionDetailAccordions } from './PensionDetailAccordions';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

describe('PensionDetailAccordions', () => {
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
    description                                            | data                                                                       | expectedToRender
    ${'render when group is GREEN and pension type is DC'} | ${{ ...mockData, group: PensionGroup.GREEN }}                              | ${true}
    ${'render when group is GREEN and pension type is DB'} | ${{ ...mockData, pensionType: PensionType.DB, group: PensionGroup.GREEN }} | ${true}
    ${'NOT render when group is YELLOW'}                   | ${{ ...mockData, group: PensionGroup.YELLOW }}                             | ${false}
    ${'NOT render when group is GREEN_NO_INCOME'}          | ${{ ...mockData, group: PensionGroup.GREEN_NO_INCOME }}                    | ${false}
    ${'NOT render if pension type is AVC'}                 | ${{ ...mockData, pensionType: PensionType.AVC }}                           | ${false}
    ${'NOT render if pension type is State Pension'}       | ${{ ...mockData, pensionType: PensionType.SP }}                            | ${false}
    ${'NOT render if pension type is CB'}                  | ${{ ...mockData, pensionType: PensionType.CB }}                            | ${false}
    ${'NOT render if pension type is CDC'}                 | ${{ ...mockData, pensionType: PensionType.CDC }}                           | ${false}
    ${'NOT render if pension type is HYB'}                 | ${{ ...mockData, pensionType: PensionType.HYB }}                           | ${false}
  `('should $description', ({ data, expectedToRender }) => {
    const { container, getByText } = render(
      <PensionDetailAccordions data={data} />,
    );

    if (expectedToRender) {
      expect(container).toMatchSnapshot();

      [
        'pages.pension-details.information.about.title',
        'pages.pension-details.information.about.description',
        'pages.pension-details.information.how-estimate-is-calculated.title',
        `pages.pension-details.information.how-estimate-is-calculated.${data.pensionType.toLowerCase()}`,
      ].forEach((text) => {
        expect(getByText(text)).toBeInTheDocument();
      });
    } else {
      expect(container.firstChild).toBeNull();
    }
  });
});
