import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useTranslation from '@maps-react/hooks/useTranslation';

import { EmployerStatus } from '../../lib/constants';
import { EmploymentMembershipPeriod } from '../../lib/types';
import { EmployerSection } from './EmployerSection';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const period = (
  overrides: Partial<EmploymentMembershipPeriod>,
): EmploymentMembershipPeriod =>
  ({
    employerName: 'Employer',
    membershipStartDate: '',
    membershipEndDate: '',
    ...overrides,
  } as EmploymentMembershipPeriod);

const employerNames = () =>
  screen.getAllByTestId('employer-name').map((node) => node.textContent);

describe('EmployerSection', () => {
  const mockUseTranslation = useTranslation as jest.Mock;
  const t = jest.fn((key: string) => key);

  beforeEach(() => {
    t.mockClear();
    mockUseTranslation.mockReturnValue({ t, locale: 'en' });
  });

  it('shows one employer name and only the rows that have data', () => {
    render(
      <EmployerSection
        periods={[
          period({
            employerName: 'ASH',
            employerStatus: EmployerStatus.C,
            membershipStartDate: '2018-04-06',
          }),
        ]}
      />,
    );

    expect(screen.getByTestId('employers-heading')).toHaveTextContent(
      'pages.pension-details.plan-details.employer-heading',
    );
    expect(screen.getByTestId('employer-name')).toHaveTextContent('ASH');
    expect(screen.getByTestId('dd-employer-status')).toHaveTextContent(
      'pages.pension-details.plan-details.employer-status-details.C',
    );
    expect(screen.getByTestId('dd-employment-start-date')).toHaveTextContent(
      '6 April 2018',
    );
    expect(
      screen.queryByTestId('dd-employment-end-date'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('employers-show-hide')).not.toBeInTheDocument();
  });

  it('shows every employer when there are two or three and no toggle', () => {
    render(
      <EmployerSection
        periods={[
          period({
            employerName: 'One',
            employerStatus: EmployerStatus.C,
            membershipStartDate: '2020-01-01',
          }),
          period({
            employerName: 'Two',
            employerStatus: EmployerStatus.H,
            membershipEndDate: '2019-01-01',
          }),
          period({ employerName: 'Three' }),
        ]}
      />,
    );

    expect(t).toHaveBeenCalledWith(
      'pages.pension-details.plan-details.employers-heading',
      { count: '3' },
    );
    expect(screen.getAllByTestId('employer-name')).toHaveLength(3);
    expect(screen.queryByTestId('employers-show-hide')).not.toBeInTheDocument();
  });

  it('hides the name when it is missing and still shows dated rows', () => {
    render(
      <EmployerSection
        periods={[
          period({
            employerName: '   ',
            membershipStartDate: '2021-02-01',
          }),
        ]}
      />,
    );

    expect(screen.queryByTestId('employer-name')).not.toBeInTheDocument();
    expect(screen.getByTestId('dd-employment-start-date')).toBeInTheDocument();
  });

  it('shows the first two employers and expands the rest', async () => {
    const user = userEvent.setup();
    render(
      <EmployerSection
        periods={[
          period({
            employerName: 'Fourth',
            employerStatus: EmployerStatus.C,
            membershipStartDate: '2018-01-01',
          }),
          period({
            employerName: 'First',
            employerStatus: EmployerStatus.C,
            membershipStartDate: '2024-01-01',
          }),
          period({
            employerName: 'Third',
            employerStatus: EmployerStatus.H,
            membershipStartDate: '2010-01-01',
            membershipEndDate: '2020-01-01',
          }),
          period({
            employerName: 'Second',
            employerStatus: EmployerStatus.C,
            membershipStartDate: '2022-01-01',
          }),
        ]}
      />,
    );

    expect(t).toHaveBeenCalledWith(
      'pages.pension-details.plan-details.employers-heading',
      { count: '4' },
    );
    expect(t).toHaveBeenCalledWith(
      'pages.pension-details.plan-details.view-more-employers',
      { count: '2' },
    );

    const extra = screen.getByTestId('expanded-content');
    expect(screen.getByTestId('employers-show-hide')).toHaveClass(
      'flex-col-reverse',
    );
    expect(extra).toHaveClass('hidden');
    expect(
      screen.getAllByTestId('employer-name').map((node) => node.textContent),
    ).toEqual(['First', 'Second', 'Fourth', 'Third']);

    const viewMore = screen.getByTestId('show-hide-view-btn');
    expect(viewMore).toHaveAttribute('aria-expanded', 'false');
    expect(viewMore).toHaveTextContent(
      'pages.pension-details.plan-details.view-more-employers',
    );

    await user.click(viewMore);

    const close = screen.getByTestId('show-hide-close-btn');
    expect(extra).toHaveClass('block');
    expect(close).toHaveAttribute('aria-expanded', 'true');
    expect(close).toHaveTextContent('common.close');

    await user.click(close);

    expect(extra).toHaveClass('hidden');
    expect(screen.getByTestId('show-hide-view-btn')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('lists current employers before historic, then records with no status', () => {
    render(
      <EmployerSection
        periods={[
          period({ employerName: 'No status' }),
          period({
            employerName: 'Historic',
            employerStatus: EmployerStatus.H,
            membershipEndDate: '2020-01-01',
          }),
          period({
            employerName: 'Current',
            employerStatus: EmployerStatus.C,
            membershipStartDate: '2021-01-01',
          }),
        ]}
      />,
    );

    expect(employerNames()).toEqual(['Current', 'Historic', 'No status']);
  });

  it('sorts current employers by most recent start date, then name', () => {
    render(
      <EmployerSection
        periods={[
          period({
            employerName: 'Older',
            employerStatus: EmployerStatus.C,
            membershipStartDate: '2019-01-01',
          }),
          period({
            employerName: 'Zed',
            employerStatus: EmployerStatus.C,
            membershipStartDate: '2022-06-01',
          }),
          period({
            employerName: 'Alpha',
            employerStatus: EmployerStatus.C,
            membershipStartDate: '2022-06-01',
          }),
          period({
            employerName: 'Missing start',
            employerStatus: EmployerStatus.C,
          }),
          period({
            employerName: 'Also missing',
            employerStatus: EmployerStatus.C,
          }),
        ]}
      />,
    );

    expect(employerNames()).toEqual([
      'Alpha',
      'Zed',
      'Older',
      'Also missing',
      'Missing start',
    ]);
  });

  it('sorts historic employers by end date, then start date, then name', () => {
    render(
      <EmployerSection
        periods={[
          period({
            employerName: 'Zed same dates',
            employerStatus: EmployerStatus.H,
            membershipStartDate: '2018-01-01',
            membershipEndDate: '2021-05-01',
          }),
          period({
            employerName: 'Alpha same dates',
            employerStatus: EmployerStatus.H,
            membershipStartDate: '2018-01-01',
            membershipEndDate: '2021-05-01',
          }),
          period({
            employerName: 'Later end',
            employerStatus: EmployerStatus.H,
            membershipEndDate: '2024-01-01',
          }),
          period({
            employerName: 'Same end later start',
            employerStatus: EmployerStatus.H,
            membershipStartDate: '2019-01-01',
            membershipEndDate: '2020-01-01',
          }),
          period({
            employerName: 'Same end earlier start',
            employerStatus: EmployerStatus.H,
            membershipStartDate: '2010-01-01',
            membershipEndDate: '2020-01-01',
          }),
        ]}
      />,
    );

    expect(employerNames()).toEqual([
      'Later end',
      'Alpha same dates',
      'Zed same dates',
      'Same end later start',
      'Same end earlier start',
    ]);
  });

  it('sorts records with no status by end date, then start date, then name when starts are missing', () => {
    render(
      <EmployerSection
        periods={[
          period({
            employerName: 'Zed',
            membershipEndDate: '2019-01-01',
          }),
          period({
            employerName: 'Alpha',
            membershipEndDate: '2019-01-01',
          }),
          period({
            employerName: 'Recent end',
            membershipEndDate: '2023-01-01',
          }),
          period({
            employerName: 'Later start',
            membershipStartDate: '2020-01-01',
            membershipEndDate: '2018-01-01',
          }),
          period({
            employerName: 'Earlier start',
            membershipStartDate: '2015-01-01',
            membershipEndDate: '2018-01-01',
          }),
        ]}
      />,
    );

    expect(employerNames()).toEqual([
      'Recent end',
      'Alpha',
      'Zed',
      'Later start',
      'Earlier start',
    ]);
  });

  it('treats a blank status as incomplete', () => {
    render(
      <EmployerSection
        periods={[
          period({
            employerName: 'Blank',
            employerStatus: '  ' as EmployerStatus,
            membershipEndDate: '2022-01-01',
          }),
          period({
            employerName: 'Current',
            employerStatus: EmployerStatus.C,
            membershipStartDate: '2020-01-01',
          }),
        ]}
      />,
    );

    expect(employerNames()).toEqual(['Current', 'Blank']);
  });
});
