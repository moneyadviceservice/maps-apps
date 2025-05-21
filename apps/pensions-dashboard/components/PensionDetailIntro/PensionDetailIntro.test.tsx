import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { mockPensionDetailsDB, mockPensionsData } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PensionDetailIntro } from './PensionDetailIntro';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('../../lib/utils');
const mockUseTranslation = useTranslation as jest.Mock;

const mockDCData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[4] as PensionArrangement;
const mockDBData = mockPensionDetailsDB as PensionArrangement;
const mockStatePensionData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[2] as PensionArrangement;
const mockNoIncomeData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[9] as PensionArrangement;
const mockPendingPensionData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

describe('PensionDetailIntro', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (
        key: string,
        params?: {
          type?: string;
          pot?: string;
          monthly?: string;
          date?: string;
          reason?: string;
        },
      ) => {
        switch (key) {
          case 'pages.pension-details.toolIntro.estimate-DC':
            return `This is a ${params?.type} pension. You’ve built up ${params?.pot} in this pension pot. This could give you an income of ${params?.monthly} a month from the pension retirement date of ${params?.date}.`;
          case 'pages.pension-details.toolIntro.estimate-DB':
            return `This is a ${params?.type} workplace pension. The amount you’re paid is based on your salary and years you’ve been a scheme member. This could give you an income of ${params?.monthly} a month from the pension retirement date of ${params?.date}.`;
          case 'pages.pension-details.toolIntro.estimate-SP':
            return `You will reach State Pension age on ${params?.date}. Your forecast is ${params?.monthly} a month.`;
          case 'pages.pension-details.toolIntro.no-estimate':
            return `This is a ${params?.type} pension. At the moment, we cannot provide an estimate at retirement because your provider needs more time to calculate an estimated income. This can take 3 working days. Check back again soon.`;
          case 'pages.pension-details.toolIntro.no-estimate-wu':
            return `This is a ${params?.type} pension. At the moment, we cannot provide an estimate at retirement. Contact Pension For Everyone: pensionAdministrator.name and give them your reference number. They'll help you resolve any issues with this pension.`;
          case 'data.pensions.types.DB':
            return `defined benefit`;
          case 'data.pensions.types.DC':
            return `defined contribution`;
          default:
            return key;
        }
      },
    });
  });

  it('renders correctly', () => {
    const { container } = render(<PensionDetailIntro data={mockDCData} />);
    expect(container).toMatchSnapshot();
  });

  it.each`
    description                                                           | data                      | unavailableCode | expectedText
    ${'with DC data with an estimate'}                                    | ${mockDCData}             | ${undefined}    | ${/This is a defined contribution pension. You’ve built up -- in this pension pot. This could give you an income of £-- a month from the pension retirement date of --./}
    ${'with DB data with an estimate'}                                    | ${mockDBData}             | ${undefined}    | ${/This is a defined benefit workplace pension. The amount you’re paid is based on your salary and years you’ve been a scheme member. This could give you an income of £-- a month from the pension retirement date of --./}
    ${'with State Pension data'}                                          | ${mockStatePensionData}   | ${undefined}    | ${/You will reach State Pension age on --. Your forecast is £-- a month./}
    ${'with DC and pension group GREEN_NO_INCOME'}                        | ${mockNoIncomeData}       | ${undefined}    | ${/This is a defined contribution pension. At the moment, we cannot provide an estimate at retirement because your provider needs more time to calculate an estimated income. This can take 3 working days. Check back again soon./}
    ${'with DC and pension group GREEN_NO_INCOME and WU unavailableCode'} | ${mockNoIncomeData}       | ${'WU'}         | ${/This is a defined contribution pension. At the moment, we cannot provide an estimate at retirement. Contact Pension For Everyone: pensionAdministrator.name and give them your reference number. They'll help you resolve any issues with this pension./}
    ${'with DC and pension group YELLOW'}                                 | ${mockPendingPensionData} | ${undefined}    | ${/This is a defined contribution pension. At the moment, we cannot provide an estimate at retirement because your provider needs more time to calculate an estimated income. This can take 3 working days. Check back again soon./}
  `(
    'renders correctly $description',
    ({ data, unavailableCode, expectedText }) => {
      const { container, getByText } = render(
        <PensionDetailIntro data={data} unavailableCode={unavailableCode} />,
      );

      expect(getByText(expectedText)).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    },
  );

  it('renders null when no data is provided', () => {
    const { container } = render(<PensionDetailIntro data={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders null when data is empty', () => {
    const { container } = render(
      <PensionDetailIntro data={{} as PensionArrangement} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
