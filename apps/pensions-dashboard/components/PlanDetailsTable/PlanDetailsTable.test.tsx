import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { NO_DATA } from '../../lib/constants';
import { mockPensionDetails, mockPensionDetailsNoData } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PlanDetailsTable } from './PlanDetailsTable';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockData = mockPensionDetails as PensionArrangement;
const mockDataEmptyData = mockPensionDetailsNoData as PensionArrangement;

describe('PlanDetailsTable', () => {
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
    const { getByText } = render(<PlanDetailsTable data={mockData} />);
    expect(
      getByText('pages.pension-details.headings.plan-details'),
    ).toBeInTheDocument();
  });

  it.each`
    description                         | header
    ${'header pension provider'}        | ${'pages.pension-details.pension-provider.provider'}
    ${'header plan reference number'}   | ${'pages.pension-details.plan-details.plan-reference'}
    ${'header pension start date'}      | ${'pages.pension-details.plan-details.pension-start-date'}
    ${'header active contributions'}    | ${'pages.pension-details.plan-details.active-contributions'}
    ${'header employer name'}           | ${'pages.pension-details.plan-details.employer-name'}
    ${'header employer status'}         | ${'pages.pension-details.plan-details.employer-status'}
    ${'header pension retirement date'} | ${'pages.pension-details.plan-details.retirement-date'}
    ${'header employment start date'}   | ${'pages.pension-details.plan-details.employment-start-date'}
    ${'header employment end date'}     | ${'pages.pension-details.plan-details.employment-end-date'}
    ${'header data illustration date'}  | ${'pages.pension-details.plan-details.data-illustration-date'}
    ${'header pension origin'}          | ${'pages.pension-details.plan-details.pension-origin'}
  `('renders $description', ({ header }) => {
    const { getByText } = render(<PlanDetailsTable data={mockData} />);
    expect(getByText(header)).toBeInTheDocument();
  });

  it.each`
    description                     | testId                    | content                              | activePension
    ${'pension provider'}           | ${'pension-provider'}     | ${'Pension Admin Highland'}          | ${'A'}
    ${'plan reference number'}      | ${'plan-reference'}       | ${'Ref/rb-dr-bd-sb-08'}              | ${'A'}
    ${'pension start date'}         | ${'pension-start-date'}   | ${'16 May 2011'}                     | ${'A'}
    ${'active contributions - yes'} | ${'active-contributions'} | ${'common.yes'}                      | ${'A'}
    ${'active contributions - no'}  | ${'active-contributions'} | ${'common.no'}                       | ${'I'}
    ${'employer name'}              | ${'employer-name'}        | ${'Borough Finance Centre'}          | ${'A'}
    ${'employer status'}            | ${'employer-status'}      | ${'data.pensions.employer-status.C'} | ${'A'}
    ${'pension retirement date'}    | ${'retirement-date'}      | ${'23 February 2042'}                | ${'A'}
    ${'employment start date'}      | ${'employment-start'}     | ${'16 May 2011'}                     | ${'A'}
    ${'employment end date'}        | ${'employment-end'}       | ${NO_DATA}                           | ${'A'}
    ${'data illustration date'}     | ${'illustration-date'}    | ${'1 January 2024'}                  | ${'A'}
    ${'pension origin'}             | ${'pension-origin'}       | ${'data.pensions.pension-origin.WM'} | ${'A'}
  `('renders $description', ({ testId, content, activePension }) => {
    const { getByTestId } = render(
      <PlanDetailsTable
        data={{
          ...mockData,
          pensionStatus: activePension,
        }}
      />,
    );
    expect(getByTestId(testId)).toHaveTextContent(content);
  });

  it.each`
    description                          | testId                    | content
    ${'no data pension start date'}      | ${'pension-start-date'}   | ${NO_DATA}
    ${'no data active contributions'}    | ${'active-contributions'} | ${NO_DATA}
    ${'no data employer name'}           | ${'employer-name'}        | ${NO_DATA}
    ${'no data employer status'}         | ${'employer-status'}      | ${NO_DATA}
    ${'no data pension retirement date'} | ${'retirement-date'}      | ${NO_DATA}
    ${'no data employment start date'}   | ${'employment-start'}     | ${NO_DATA}
    ${'no data employment end date'}     | ${'employment-end'}       | ${NO_DATA}
    ${'no data data illustration date'}  | ${'illustration-date'}    | ${NO_DATA}
    ${'no data pension origin'}          | ${'pension-origin'}       | ${NO_DATA}
    ${'no plan reference number'}        | ${'plan-reference'}       | ${NO_DATA}
  `('renders $description', ({ testId, content }) => {
    const { getByTestId } = render(
      <PlanDetailsTable data={mockDataEmptyData} />,
    );
    expect(getByTestId(testId)).toHaveTextContent(content);
  });
});
