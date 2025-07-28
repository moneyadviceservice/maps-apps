import useTranslation from '@maps-react/hooks/useTranslation';

import { NO_DATA, PensionStatus } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import {
  formatDate,
  getLatestEmployment,
  getMostRecentBenefitIllustration,
  getRetirementDate,
} from '../../lib/utils';
import { DetailRow } from '../PensionDetailRow';
import { TableSection } from '../TableSection';

const cellClasses =
  'pb-3 md:pt-[14px] md:pb-4 text-left align-top max-md:block';

type PlanDetailsTableProps = {
  data: PensionArrangement;
};
export const PlanDetailsTable = ({ data }: PlanDetailsTableProps) => {
  const { t } = useTranslation();
  const {
    pensionStatus,
    pensionAdministrator,
    startDate,
    contactReference,
    employmentMembershipPeriods,
    pensionOrigin,
  } = data;
  const activeStatus =
    pensionStatus === PensionStatus.A ? t('common.yes') : t('common.no');

  const employmentRecord = getLatestEmployment(employmentMembershipPeriods);

  const mostRecentIllustration = getMostRecentBenefitIllustration(
    data.benefitIllustrations,
  );

  return (
    <TableSection heading={t('pages.pension-details.headings.plan-details')}>
      <tbody className="max-md:block">
        <DetailRow
          heading={t('pages.pension-details.pension-provider.provider')}
        >
          <td className={cellClasses} data-testid="pension-provider">
            {pensionAdministrator.name}
          </td>
        </DetailRow>
        <DetailRow
          heading={t('pages.pension-details.plan-details.plan-reference')}
        >
          <td className={cellClasses} data-testid="plan-reference">
            {contactReference ?? NO_DATA}
          </td>
        </DetailRow>
        <DetailRow
          heading={t('pages.pension-details.plan-details.pension-start-date')}
        >
          <td className={cellClasses} data-testid="pension-start-date">
            {startDate ? formatDate(startDate) : NO_DATA}
          </td>
        </DetailRow>
        <DetailRow
          heading={t('pages.pension-details.plan-details.active-contributions')}
        >
          <td className={cellClasses} data-testid="active-contributions">
            {pensionStatus ? activeStatus : NO_DATA}
          </td>
        </DetailRow>
        <DetailRow
          heading={t('pages.pension-details.plan-details.employer-name')}
        >
          <td className={cellClasses} data-testid="employer-name">
            {employmentRecord?.employerName ?? NO_DATA}
          </td>
        </DetailRow>
        <DetailRow
          heading={t('pages.pension-details.plan-details.employer-status')}
        >
          <td className={cellClasses} data-testid="employer-status">
            {employmentRecord?.employerStatus
              ? t(
                  `data.pensions.employer-status.${employmentRecord.employerStatus}`,
                )
              : NO_DATA}
          </td>
        </DetailRow>
        <DetailRow
          heading={t('pages.pension-details.plan-details.retirement-date')}
        >
          <td className={cellClasses} data-testid="retirement-date">
            {getRetirementDate(data)}
          </td>
        </DetailRow>
        <DetailRow
          heading={t(
            'pages.pension-details.plan-details.employment-start-date',
          )}
        >
          <td className={cellClasses} data-testid="employment-start">
            {employmentRecord
              ? formatDate(employmentRecord.membershipStartDate)
              : NO_DATA}
          </td>
        </DetailRow>
        <DetailRow
          heading={t('pages.pension-details.plan-details.employment-end-date')}
        >
          <td className={cellClasses} data-testid="employment-end">
            {employmentRecord
              ? formatDate(employmentRecord.membershipEndDate)
              : NO_DATA}
          </td>
        </DetailRow>
        <DetailRow
          heading={t(
            'pages.pension-details.plan-details.data-illustration-date',
          )}
        >
          <td className={cellClasses} data-testid="illustration-date">
            {mostRecentIllustration
              ? formatDate(mostRecentIllustration.illustrationDate)
              : NO_DATA}
          </td>
        </DetailRow>
        <DetailRow
          heading={t('pages.pension-details.plan-details.pension-origin')}
        >
          <td className={cellClasses} data-testid="pension-origin">
            {pensionOrigin
              ? t(`data.pensions.pension-origin.${pensionOrigin}`)
              : NO_DATA}
          </td>
        </DetailRow>
      </tbody>
    </TableSection>
  );
};
