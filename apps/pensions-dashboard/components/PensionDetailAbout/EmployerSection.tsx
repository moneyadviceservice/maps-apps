import { Fragment } from 'react';

import { H2, Heading } from '@maps-react/common/components/Heading';
import { ShowHide } from '@maps-react/common/components/ShowHide';
import useTranslation from '@maps-react/hooks/useTranslation';

import { EmployerStatus } from '../../lib/constants';
import { EmploymentMembershipPeriod } from '../../lib/types';
import { formatDate } from '../../lib/utils/ui';
import { DefinitionDescription } from '../DefinitionList/DefinitionDescription';
import { DefinitionTerm } from '../DefinitionList/DefinitionTerm';

type EmployerSectionProps = {
  periods: EmploymentMembershipPeriod[];
};

const PREVIEW_COUNT = 2;

const timestamp = (value?: string): number | null => {
  if (!value?.trim()) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
};

const compareRecentFirst = (a: number | null, b: number | null): number => {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return b - a;
};

const compareName = (
  a: EmploymentMembershipPeriod,
  b: EmploymentMembershipPeriod,
): number =>
  (a.employerName ?? '').localeCompare(b.employerName ?? '', 'en', {
    sensitivity: 'base',
  });

const statusGroup = (period: EmploymentMembershipPeriod): number => {
  const status = period.employerStatus?.trim();
  if (status === EmployerStatus.C) return 0;
  if (status === EmployerStatus.H) return 1;
  return 2;
};

const compareCurrent = (
  a: EmploymentMembershipPeriod,
  b: EmploymentMembershipPeriod,
): number => {
  const start = compareRecentFirst(
    timestamp(a.membershipStartDate),
    timestamp(b.membershipStartDate),
  );
  if (start !== 0) return start;
  return compareName(a, b);
};

const compareHistoric = (
  a: EmploymentMembershipPeriod,
  b: EmploymentMembershipPeriod,
): number => {
  const end = compareRecentFirst(
    timestamp(a.membershipEndDate),
    timestamp(b.membershipEndDate),
  );
  if (end !== 0) return end;
  const start = compareRecentFirst(
    timestamp(a.membershipStartDate),
    timestamp(b.membershipStartDate),
  );
  if (start !== 0) return start;
  return compareName(a, b);
};

const compareIncomplete = (
  a: EmploymentMembershipPeriod,
  b: EmploymentMembershipPeriod,
): number => {
  const end = compareRecentFirst(
    timestamp(a.membershipEndDate),
    timestamp(b.membershipEndDate),
  );
  if (end !== 0) return end;

  const aStart = timestamp(a.membershipStartDate);
  const bStart = timestamp(b.membershipStartDate);
  if (aStart === null && bStart === null) return compareName(a, b);
  return compareRecentFirst(aStart, bStart);
};

const sortEmploymentPeriods = (
  periods: EmploymentMembershipPeriod[],
): EmploymentMembershipPeriod[] =>
  [...periods].sort((a, b) => {
    const group = statusGroup(a) - statusGroup(b);
    if (group !== 0) return group;

    if (statusGroup(a) === 0) return compareCurrent(a, b);
    if (statusGroup(a) === 1) return compareHistoric(a, b);
    return compareIncomplete(a, b);
  });

type EmployerRow = {
  title: string;
  value: string;
  testId: string;
};

export const EmployerSection = ({ periods }: EmployerSectionProps) => {
  const { t, locale } = useTranslation();
  const sorted = sortEmploymentPeriods(periods);
  const canToggle = sorted.length >= 4;
  const preview = canToggle ? sorted.slice(0, PREVIEW_COUNT) : sorted;
  const remainder = canToggle ? sorted.slice(PREVIEW_COUNT) : [];

  const heading =
    sorted.length === 1
      ? t('pages.pension-details.plan-details.employer-heading')
      : t('pages.pension-details.plan-details.employers-heading', {
          count: String(sorted.length),
        });

  const rowsFor = (period: EmploymentMembershipPeriod): EmployerRow[] => {
    const rows: EmployerRow[] = [];

    const status = period.employerStatus?.trim();
    if (status) {
      rows.push({
        title: t('pages.pension-details.plan-details.employer-status'),
        value: t(
          `pages.pension-details.plan-details.employer-status-details.${status}`,
        ),
        testId: 'employer-status',
      });
    }

    if (period.membershipStartDate) {
      rows.push({
        title: t('pages.pension-details.plan-details.employment-start-date'),
        value: formatDate(period.membershipStartDate, locale),
        testId: 'employment-start-date',
      });
    }

    if (period.membershipEndDate) {
      rows.push({
        title: t('pages.pension-details.plan-details.employment-end-date'),
        value: formatDate(period.membershipEndDate, locale),
        testId: 'employment-end-date',
      });
    }

    return rows;
  };

  const renderPeriod = (
    period: EmploymentMembershipPeriod,
    index: number,
    isFirst: boolean,
  ) => (
    <div
      key={`${period.employerName}-${period.membershipStartDate}-${period.membershipEndDate}-${index}`}
      data-testid="employer-block"
      className={isFirst ? undefined : 'mt-8'}
    >
      {period.employerName?.trim() && (
        <Heading
          level="h4"
          component="h3"
          className="mb-2"
          data-testid="employer-name"
        >
          {period.employerName}
        </Heading>
      )}
      <dl className="md:grid md:grid-cols-[42%_58%]">
        {rowsFor(period).map((row) => (
          <Fragment key={row.testId}>
            <DefinitionTerm testId={row.testId}>{row.title}</DefinitionTerm>
            <DefinitionDescription testId={row.testId}>
              {row.value}
            </DefinitionDescription>
          </Fragment>
        ))}
      </dl>
    </div>
  );

  return (
    <div
      data-testid="employers-section"
      className="p-4 pb-9 mb-9 bg-slate-300 rounded-bl-[24px] lg:p-14 lg:pt-13 lg:rounded-bl-[40px] xl:w-10/12 2xl:w-9/12"
    >
      <H2 data-testid="employers-heading" className="mb-7 md:text-5xl md:mb-10">
        {heading}
      </H2>
      {preview.map((period, index) => renderPeriod(period, index, index === 0))}
      {canToggle && (
        <div className="mt-8">
          <ShowHide
            testId="employers-show-hide"
            showMoreText={t('common.close')}
            showLessText={t(
              'pages.pension-details.plan-details.view-more-employers',
              { count: String(sorted.length - PREVIEW_COUNT) },
            )}
          >
            {remainder.map((period, index) =>
              renderPeriod(period, index + PREVIEW_COUNT, index === 0),
            )}
          </ShowHide>
        </div>
      )}
    </div>
  );
};
