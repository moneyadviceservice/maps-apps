import React from 'react';

import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionStatus } from '../../lib/constants';
import { mockPensionsData } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PensionDetailAbout } from './PensionDetailAbout';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

describe('PensionDetailAbout', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders definition list with correct title', () => {
    render(<PensionDetailAbout data={mockData} />);
    expect(screen.getByTestId('definition-list')).toBeInTheDocument();
    expect(screen.getByTestId('definition-list-title')).toHaveTextContent(
      'pages.pension-details.headings.about-this-pension',
    );
  });

  it.each`
    description                         | testid                     | value
    ${'displays provider'}              | ${'provider'}              | ${'Pension Admin Highland'}
    ${'displays contact reference'}     | ${'contact-reference'}     | ${'Ref/rb-dr-bd-sb-08'}
    ${'displays start date'}            | ${'start-date'}            | ${'16 May 2011'}
    ${'displays pension status'}        | ${'status'}                | ${'common.no'}
    ${'displays employer name'}         | ${'employer-name'}         | ${'Borough Finance Centre'}
    ${'displays employer status'}       | ${'employer-status'}       | ${'pages.pension-details.plan-details.employer-status-details.C'}
    ${'displays employment start date'} | ${'employment-start-date'} | ${'16 May 2011'}
    ${'displays employment end date'}   | ${'employment-end-date'}   | ${'16 May 2020'}
  `('$description', ({ testid, value }) => {
    const mockDataEndDate = {
      ...mockData,
      employmentMembershipPeriods: [
        {
          membershipStartDate: '2011-05-16',
          membershipEndDate: '2020-05-16',
          employerName: 'Borough Finance Centre',
          employerStatus: 'C',
        },
      ],
    } as PensionArrangement;
    render(<PensionDetailAbout data={mockDataEndDate} />);
    expect(screen.getByTestId('dd-' + testid)).toHaveTextContent(value);
  });

  it('displays active contributions status for active pension', () => {
    render(
      <PensionDetailAbout
        data={{ ...mockData, pensionStatus: PensionStatus.A }}
      />,
    );
    expect(screen.getByTestId('dd-status')).toHaveTextContent('common.yes');
  });

  it('handles missing data gracefully', () => {
    const minimalData = {} as PensionArrangement;
    render(<PensionDetailAbout data={minimalData} />);
    expect(screen.getByTestId('dt-provider')).toBeInTheDocument();
    expect(screen.getByTestId('dd-provider')).toHaveTextContent(
      'common.unavailable',
    );
    expect(screen.getByTestId('dt-contact-reference')).toBeInTheDocument();
    expect(screen.getByTestId('dd-contact-reference')).toHaveTextContent(
      'common.unavailable',
    );
    expect(screen.queryByTestId('dt-start-date')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dt-status')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dt-pension-origin')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dt-employer-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dt-employer-status')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('dt-employment-start-date'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('dt-employment-end-date'),
    ).not.toBeInTheDocument();
  });

  it('sorts employmentMembershipPeriods by membershipStartDate', () => {
    const mockDataWithPeriods = {
      ...mockData,
      employmentMembershipPeriods: [
        {
          membershipStartDate: '2015-01-01',
          employerName: 'Employer A',
          employerStatus: 'C',
        },
        {
          membershipStartDate: '2020-01-01',
          employerName: 'Employer B',
          employerStatus: 'C',
        },
      ],
    } as PensionArrangement;

    render(<PensionDetailAbout data={mockDataWithPeriods} />);
    const periods = screen.getAllByTestId('dd-employer-name');
    expect(periods[0]).toHaveTextContent('Employer B');
    expect(periods[1]).toHaveTextContent('Employer A');
  });

  it('does not display employment data when employmentMembershipPeriods contains only empty objects', () => {
    const mockDataWithEmptyPeriods = {
      ...mockData,
      employmentMembershipPeriods: [{}],
    } as PensionArrangement;

    render(<PensionDetailAbout data={mockDataWithEmptyPeriods} />);
    expect(screen.queryByTestId('dt-employer-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dt-employer-status')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('dt-employment-start-date'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('dt-employment-end-date'),
    ).not.toBeInTheDocument();
  });

  it('does not display employment data when employmentMembershipPeriods contains multiple empty objects', () => {
    const mockDataWithMultipleEmptyPeriods = {
      ...mockData,
      employmentMembershipPeriods: [{}, {}, {}],
    } as PensionArrangement;

    render(<PensionDetailAbout data={mockDataWithMultipleEmptyPeriods} />);
    expect(screen.queryByTestId('dt-employer-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dt-employer-status')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('dt-employment-start-date'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('dt-employment-end-date'),
    ).not.toBeInTheDocument();
  });

  it('displays employment data when employmentMembershipPeriods has mix of empty and valid objects', () => {
    const mockDataWithMixedPeriods = {
      ...mockData,
      employmentMembershipPeriods: [
        {},
        {
          membershipStartDate: '2020-01-01',
          employerName: 'Valid Employer',
          employerStatus: 'C',
        },
        {},
      ],
    } as PensionArrangement;

    render(<PensionDetailAbout data={mockDataWithMixedPeriods} />);
    expect(screen.getByTestId('dt-employer-name')).toBeInTheDocument();
    expect(screen.getByTestId('dd-employer-name')).toHaveTextContent(
      'Valid Employer',
    );
  });

  it('does not display employment data when employmentMembershipPeriods is an empty array', () => {
    const mockDataWithEmptyArray = {
      ...mockData,
      employmentMembershipPeriods: [],
    } as PensionArrangement;

    render(<PensionDetailAbout data={mockDataWithEmptyArray} />);
    expect(screen.queryByTestId('dt-employer-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dt-employer-status')).not.toBeInTheDocument();
  });
});
