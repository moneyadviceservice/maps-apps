import React from 'react';

import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { DefinitionList } from '../../components/DefinitionList';
import { PensionStatus as Status } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import { filterValidEmploymentPeriods } from '../../lib/utils/data';
import { formatDate, tooltipScreenReaderText } from '../../lib/utils/ui';

type DetailsAboutProps = {
  data: PensionArrangement;
};

export const PensionDetailAbout = ({ data }: DetailsAboutProps) => {
  const { t, locale } = useTranslation();

  const listData = [
    {
      title: t('common.provider'),
      value: data.pensionAdministrator?.name ?? t('common.unavailable'),
      testId: 'provider',
    },
    {
      title: t('pages.pension-details.plan-details.plan-reference'),
      value: data.contactReference ?? t('common.unavailable'),
      testId: 'contact-reference',
    },
    ...(data.startDate
      ? [
          {
            title: t('common.pension-opened'),
            value: formatDate(data.startDate, locale),
            testId: 'start-date',
          },
        ]
      : []),
    ...(data.pensionStatus
      ? [
          {
            title: t('pages.pension-details.plan-details.active-contributions'),
            value:
              data.pensionStatus === Status.A
                ? t('common.yes')
                : t('common.no'),
            testId: 'status',
          },
        ]
      : []),
    ...(() => {
      const employmentPeriods = filterValidEmploymentPeriods(
        data.employmentMembershipPeriods,
      );
      return employmentPeriods?.length
        ? employmentPeriods
            .toSorted((a, b) => {
              return (
                new Date(b.membershipStartDate).getTime() -
                new Date(a.membershipStartDate).getTime()
              );
            })
            .flatMap((period, index) => {
              const hasEmployerStatus = !!period.employerStatus?.trim();

              const entries = [
                {
                  title: `${t(
                    'pages.pension-details.plan-details.employer-name',
                  )} ${
                    index === 0
                      ? t('pages.pension-details.plan-details.most-recent')
                      : ''
                  }`,
                  value: period.employerName,
                  testId: 'employer-name',
                },
                ...(hasEmployerStatus
                  ? [
                      {
                        title: t(
                          'pages.pension-details.plan-details.employer-status',
                        ),
                        value: t(
                          `pages.pension-details.plan-details.employer-status-details.${period.employerStatus}`,
                        ),
                        testId: 'employer-status',
                      },
                    ]
                  : []),
              ];

              if (period.membershipStartDate) {
                entries.push({
                  title: t(
                    'pages.pension-details.plan-details.employment-start-date',
                  ),
                  value: formatDate(period.membershipStartDate, locale),
                  testId: 'employment-start-date',
                });
              }

              if (period.membershipEndDate) {
                entries.push({
                  title: t(
                    'pages.pension-details.plan-details.employment-end-date',
                  ),
                  value: formatDate(period.membershipEndDate, locale),
                  testId: 'employment-end-date',
                });
              }

              return entries;
            })
        : [];
    })(),
    ...(data.pensionOrigin
      ? [
          {
            title: (
              <>
                {t('pages.pension-details.plan-details.pension-origin')}{' '}
                <Markdown
                  className="ml-1"
                  disableParagraphs
                  content={t('tooltips.pension-origin')}
                  tooltipProps={{
                    accessibilityLabelOpen: tooltipScreenReaderText(
                      t('tooltips.sr-text.pension-origin'),
                      t,
                    ),
                  }}
                />
              </>
            ),
            value: t(`data/pension-origin.${data.pensionOrigin}`) + '.',
            testId: 'pension-origin',
          },
        ]
      : []),
  ];

  return (
    <DefinitionList
      title={t('pages.pension-details.headings.about-this-pension')}
      items={listData}
      titleFocusId="details-heading"
    />
  );
};
