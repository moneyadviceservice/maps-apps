import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { NO_DATA } from '../../lib/constants';
import {
  mockPensionDetails,
  mockPensionDetailsDB,
  mockPensionsData,
} from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PensionDetailsSection } from './PensionDetailsSection';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockData = mockPensionDetails as PensionArrangement;
const mockDataDB = mockPensionDetailsDB as PensionArrangement;
const mockDataSP = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[2] as PensionArrangement;

describe('PensionDetailsSection', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          'common.a-month': 'a month',
          'common.a-year': 'a year',
        };
        return translations[key];
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { container } = render(<PensionDetailsSection data={mockData} />);
    expect(container).toMatchSnapshot();
  });

  it('renders null when benefitIllustrations is not provided', () => {
    const { container } = render(
      <PensionDetailsSection
        data={{ ...mockData, benefitIllustrations: undefined }}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it.each`
    description                    | data          | title                  | current               | retirement
    ${'displays monthly row'}      | ${mockData}   | ${'monthly-amount'}    | ${'£958.50 a month'}  | ${'£958.50 a month'}
    ${'displays annual row'}       | ${mockData}   | ${'annual-amount'}     | ${'£11,502 a year'}   | ${'£11,502 a year'}
    ${'displays pot value row'}    | ${mockData}   | ${'pot-value'}         | ${'£235,000'}         | ${'£235,000'}
    ${'displays tax free row'}     | ${mockDataDB} | ${'tax-free-lump-sum'} | ${'£9,999'}           | ${'£9,999'}
    ${'displays payable date row'} | ${mockDataSP} | ${'payable-date'}      | ${'23 February 2042'} | ${'23 February 2042'}
  `('$description', ({ data, title, current, retirement }) => {
    const { container, getByTestId } = render(
      <PensionDetailsSection data={data} />,
    );
    expect(getByTestId(`current-${title}`)).toHaveTextContent(current);
    expect(getByTestId(`retirement-${title}`)).toHaveTextContent(retirement);
    expect(container).toMatchSnapshot();
  });

  it.each`
    description                                        | data                                               | title                  | expectedText
    ${'displays monthly row with no data'}             | ${mockData}                                        | ${'monthly-amount'}    | ${NO_DATA}
    ${'displays annual row with no data'}              | ${mockData}                                        | ${'annual-amount'}     | ${NO_DATA}
    ${'displays pot value row with no data'}           | ${mockData}                                        | ${'pot-value'}         | ${NO_DATA}
    ${'displays tax free row with no data'}            | ${mockDataDB}                                      | ${'tax-free-lump-sum'} | ${NO_DATA}
    ${'displays payable date row with no data'}        | ${{ ...mockDataSP, retirementDate: null }}         | ${'payable-date'}      | ${NO_DATA}
    ${'displays retirement date when no payable date'} | ${{ ...mockDataSP, retirementDate: '01/01/1970' }} | ${'payable-date'}      | ${'1 January 1970'}
  `('$description', ({ data, title, expectedText }) => {
    const { container, getByTestId } = render(
      <PensionDetailsSection
        data={{
          ...data,
          benefitIllustrations: [],
        }}
      />,
    );
    expect(getByTestId(`current-${title}`)).toHaveTextContent(expectedText);
    expect(getByTestId(`retirement-${title}`)).toHaveTextContent(expectedText);
    expect(container).toMatchSnapshot();
  });

  it.each`
    description                                                  | data          | title
    ${'does not display pot value row if pension type is DB'}    | ${mockDataDB} | ${'pot-value'}
    ${'does not display tax free if pension type is DC'}         | ${mockData}   | ${'tax-free-lump-sum'}
    ${'does not display payable date row if pension type is DC'} | ${mockData}   | ${'payable-date'}
    ${'does not display payable date row if pension type is DB'} | ${mockDataDB} | ${'payable-date'}
  `('$description', ({ data, title }) => {
    const { container, queryByTestId } = render(
      <PensionDetailsSection data={data} />,
    );
    expect(queryByTestId(`current-${title}`)).toBeNull();
    expect(queryByTestId(`retirement-${title}`)).toBeNull();
    expect(container).toMatchSnapshot();
  });
});
