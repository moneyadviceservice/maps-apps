import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { NO_DATA } from '../../lib/constants';
import { mockPensionDetails, mockPensionsData } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { OtherDetailsTable } from './OtherDetailsTable';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockData = mockPensionDetails as PensionArrangement;
const mockDataEmptyData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;
describe('OtherDetailsTable', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders component', () => {
    const { getByText } = render(<OtherDetailsTable data={mockData} />);
    expect(
      getByText('pages.pension-details.headings.other-details'),
    ).toBeInTheDocument();
  });

  it.each`
    description                             | header
    ${'header calculation method for ERI'}  | ${'pages.pension-details.other-details.calculation-method (ERI)'}
    ${'header calculation method for AP'}   | ${'pages.pension-details.other-details.calculation-method (AP)'}
    ${'header amount type for ERI'}         | ${'pages.pension-details.other-details.amount-type (ERI)'}
    ${'header amount type for AP'}          | ${'pages.pension-details.other-details.amount-type (AP)'}
    ${'header last payment date for ERI'}   | ${'pages.pension-details.other-details.last-payment-date (ERI)'}
    ${'header last payment date for AP'}    | ${'pages.pension-details.other-details.last-payment-date (AP)'}
    ${'header increasing for ERI'}          | ${'pages.pension-details.other-details.increase (ERI)'}
    ${'header increasing for AP'}           | ${'pages.pension-details.other-details.increase (AP)'}
    ${'header survivor benefit for ERI'}    | ${'pages.pension-details.other-details.survivor-benefit (ERI)'}
    ${'header survivor benefit for AP'}     | ${'pages.pension-details.other-details.survivor-benefit (AP)'}
    ${'header safeguarded benefit for ERI'} | ${'pages.pension-details.other-details.safeguarded-benefit (ERI)'}
    ${'header safeguarded benefit for AP'}  | ${'pages.pension-details.other-details.safeguarded-benefit (AP)'}
    ${'header warning for ERI'}             | ${'pages.pension-details.other-details.warning (ERI)'}
    ${'header warning for AP'}              | ${'pages.pension-details.other-details.warning (AP)'}
  `('renders $description', ({ header }) => {
    const { getByText } = render(<OtherDetailsTable data={mockData} />);
    expect(getByText(header)).toBeInTheDocument();
  });

  it.each`
    description                              | testId                       | content
    ${'calculation method content for ERI'}  | ${'calculation-method-eri'}  | ${'data.pensions.calculation-method.SMPI'}
    ${'calculation method content for AP'}   | ${'calculation-method-ap'}   | ${'data.pensions.calculation-method.CBI'}
    ${'amount type content for ERI'}         | ${'amount-type-eri'}         | ${'data.pensions.amount-type.INC'}
    ${'amount type content for AP'}          | ${'amount-type-ap'}          | ${'data.pensions.amount-type.INCL'}
    ${'last payment date content for ERI'}   | ${'last-payment-eri'}        | ${'23 February 2054'}
    ${'last payment date content for AP'}    | ${'last-payment-ap'}         | ${NO_DATA}
    ${'increasing content for ERI'}          | ${'increasing-eri'}          | ${'common.yes'}
    ${'increasing content for AP'}           | ${'increasing-ap'}           | ${'common.no'}
    ${'survivor benefit content for ERI'}    | ${'survivor-benefit-eri'}    | ${'common.yes'}
    ${'survivor benefit content for AP'}     | ${'survivor-benefit-ap'}     | ${'common.no'}
    ${'safeguarded benefit content for ERI'} | ${'safeguarded-benefit-eri'} | ${'common.yes'}
    ${'safeguarded benefit content for AP'}  | ${'safeguarded-benefit-ap'}  | ${'common.no'}
    ${'warning content for ERI'}             | ${'warning-eri'}             | ${'AVC, CUR, DEF, FAS, PEO'}
    ${'warning content for AP'}              | ${'warning-ap'}              | ${'PNR, PSO, SPA, TVI, INP'}
  `('renders $description', ({ testId, content }) => {
    const { getByTestId } = render(<OtherDetailsTable data={mockData} />);
    expect(getByTestId(testId)).toHaveTextContent(content);
  });

  it.each`
    description                                      | testId                       | content
    ${'no data calculation method content for ERI'}  | ${'calculation-method-eri'}  | ${NO_DATA}
    ${'no data calculation method content for AP'}   | ${'calculation-method-ap'}   | ${NO_DATA}
    ${'no data amount type content for ERI'}         | ${'amount-type-eri'}         | ${NO_DATA}
    ${'no data amount type content for AP'}          | ${'amount-type-ap'}          | ${NO_DATA}
    ${'no data last payment date content for ERI'}   | ${'last-payment-eri'}        | ${NO_DATA}
    ${'no data last payment date content for AP'}    | ${'last-payment-ap'}         | ${NO_DATA}
    ${'no data increasing content for ERI'}          | ${'increasing-eri'}          | ${NO_DATA}
    ${'no data increasing content for AP'}           | ${'increasing-ap'}           | ${NO_DATA}
    ${'no data survivor benefit content for ERI'}    | ${'survivor-benefit-eri'}    | ${NO_DATA}
    ${'no data survivor benefit content for AP'}     | ${'survivor-benefit-ap'}     | ${NO_DATA}
    ${'no data safeguarded benefit content for ERI'} | ${'safeguarded-benefit-eri'} | ${NO_DATA}
    ${'no data safeguarded benefit content for AP'}  | ${'safeguarded-benefit-ap'}  | ${NO_DATA}
    ${'no data warning content for ERI'}             | ${'warning-eri'}             | ${NO_DATA}
    ${'no data warning content for AP'}              | ${'warning-ap'}              | ${NO_DATA}
  `('renders $description', ({ testId, content }) => {
    const { getByTestId } = render(
      <OtherDetailsTable data={mockDataEmptyData} />,
    );
    expect(getByTestId(testId)).toHaveTextContent(content);
  });
});
