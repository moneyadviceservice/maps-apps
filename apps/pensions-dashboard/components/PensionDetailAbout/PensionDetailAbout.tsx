import React from 'react';

import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { DefinitionList } from '../../components/DefinitionList';
import { PensionStatus as Status, PensionType } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import { filterValidEmploymentPeriods } from '../../lib/utils/data';
import { formatDate, tooltipScreenReaderText } from '../../lib/utils/ui';
import { EmployerSection } from './EmployerSection';

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

  const employmentPeriods =
    data.pensionType === PensionType.SP
      ? undefined
      : filterValidEmploymentPeriods(data.employmentMembershipPeriods);

  return (
    <>
      <DefinitionList
        title={t('pages.pension-details.headings.about-this-pension')}
        items={listData}
        titleFocusId="details-heading"
      />
      {employmentPeriods?.length ? (
        <EmployerSection periods={employmentPeriods} />
      ) : null}
    </>
  );
};
