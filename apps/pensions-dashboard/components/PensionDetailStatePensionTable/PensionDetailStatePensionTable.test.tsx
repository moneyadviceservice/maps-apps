import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { NO_DATA } from '../../lib/constants';
import { mockPensionDetailsSP } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PensionDetailStatePensionTable } from './PensionDetailStatePensionTable';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockDataSP = mockPensionDetailsSP as PensionArrangement;

describe('PensionDetailStatePensionTable', () => {
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
    const { container } = render(
      <PensionDetailStatePensionTable data={mockDataSP} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders null when benefitIllustrations is not provided', () => {
    const { container } = render(
      <PensionDetailStatePensionTable
        data={{ ...mockDataSP, benefitIllustrations: undefined }}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it.each`
    description                | data          | title
    ${'displays estimate row'} | ${mockDataSP} | ${'estimate-today'}
    ${'displays forecast row'} | ${mockDataSP} | ${'forecast'}
  `('$description', ({ data, title }) => {
    const { container, getByTestId } = render(
      <PensionDetailStatePensionTable data={data} />,
    );
    expect(getByTestId(`monthly-${title}`)).toHaveTextContent(
      '£958.50 a month',
    );
    expect(getByTestId(`yearly-${title}`)).toHaveTextContent('£11,502 a year');
    expect(getByTestId(`payable-date-${title}`)).toHaveTextContent(
      '23 February 2042',
    );
    expect(container).toMatchSnapshot();
  });

  it.each`
    description                             | data          | title
    ${'displays estimate row with no data'} | ${mockDataSP} | ${'estimate-today'}
    ${'displays forecast row with no data'} | ${mockDataSP} | ${'forecast'}
  `('$description', ({ data, title }) => {
    const { container, getByTestId } = render(
      <PensionDetailStatePensionTable
        data={{
          ...data,
          benefitIllustrations: [],
          retirementDate: null,
          detailData: { incomeAndValues: [] },
        }}
      />,
    );
    expect(getByTestId(`monthly-${title}`)).toHaveTextContent(NO_DATA);
    expect(getByTestId(`yearly-${title}`)).toHaveTextContent(NO_DATA);
    expect(getByTestId(`payable-date-${title}`)).toHaveTextContent(NO_DATA);
    expect(container).toMatchSnapshot();
  });

  it.each`
    description             | title
    ${'estimate today row'} | ${'estimate-today'}
    ${'forecast row'}       | ${'forecast'}
  `(
    'displays retirement date when no payable date is found for $description',
    ({ title }) => {
      const { getByTestId } = render(
        <PensionDetailStatePensionTable
          data={{
            ...mockDataSP,
            benefitIllustrations: [],
            retirementDate: '2025-01-01',
            detailData: { incomeAndValues: [], warnings: [] },
          }}
        />,
      );
      expect(getByTestId(`payable-date-${title}`)).toHaveTextContent(
        '1 January 2025',
      );
    },
  );
});
