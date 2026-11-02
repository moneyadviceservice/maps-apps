import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionGroup } from '../../lib/constants';
import { mockPensionsData } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PensionDetailStatePensionAccordion } from './PensionDetailStatePensionAccordion';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

describe('PensionDetailStatePensionAccordion', () => {
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
    description                                            | data                                                    | expectedToRender
    ${'render when group is GREEN and pension type is SP'} | ${{ ...mockData, group: PensionGroup.GREEN }}           | ${true}
    ${'NOT render when group is YELLOW'}                   | ${{ ...mockData, group: PensionGroup.YELLOW }}          | ${false}
    ${'NOT render when group is GREEN_NO_INCOME'}          | ${{ ...mockData, group: PensionGroup.GREEN_NO_INCOME }} | ${false}
  `('should $description', ({ data, expectedToRender }) => {
    const { container, getByText } = render(
      <PensionDetailStatePensionAccordion data={data} />,
    );

    if (expectedToRender) {
      expect(container).toMatchSnapshot();

      [
        'pages.pension-details.information.about.title',
        'pages.pension-details.information.about.sp-description',
      ].forEach((text) => {
        expect(getByText(text)).toBeInTheDocument();
      });
    } else {
      expect(container.firstChild).toBeNull();
    }
  });
});
