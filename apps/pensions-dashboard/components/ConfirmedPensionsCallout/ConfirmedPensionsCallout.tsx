import { Heading } from '@maps-react/common/components/Heading';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionType, STATE_RETIREMENT_AGE } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import { getRetirementAge, processBenefitIllustrations } from '../../lib/utils';

type ConfirmedPensionsCalloutProps = {
  data: PensionArrangement;
};

export const ConfirmedPensionsCallout = ({
  data: {
    schemeName,
    employmentMembershipPeriods,
    pensionAdministrator: { name },
    externalAssetId,
    pensionType,
    benefitIllustrations,
    retirementDate,
    dateOfBirth,
  },
}: ConfirmedPensionsCalloutProps) => {
  const { t, locale } = useTranslation();

  const { monthlyAmount } = processBenefitIllustrations(
    benefitIllustrations,
    t,
  );

  return (
    <InformationCallout className="px-6 py-6">
      <Heading
        color="text-blue-800"
        level="h4"
        className="flex gap-2 mt-0 mb-4 items-top"
      >
        {pensionType === PensionType.SP ? schemeName : name}
      </Heading>

      {pensionType !== 'SP' && (
        <>
          <Paragraph className="mb-0 text-gray-400">
            {t('common.scheme')}:
          </Paragraph>
          <Paragraph>{schemeName}</Paragraph>
        </>
      )}

      {pensionType === PensionType.SP && <Paragraph>{name}</Paragraph>}

      {employmentMembershipPeriods?.length && (
        <Paragraph className="mb-0 text-gray-400">
          {t('common.employer')}:
        </Paragraph>
      )}

      {employmentMembershipPeriods?.length &&
        employmentMembershipPeriods.map((employer, idx) => (
          <Paragraph
            className="pb-2 mb-2 border-b-1 border-slate-400"
            key={`${employer.employerName}-${idx}`}
          >
            {employer.employerName}
          </Paragraph>
        ))}

      <Paragraph className="mb-0 text-gray-400">
        {t('common.retirement-age')}
      </Paragraph>

      <Paragraph className="pb-2 mb-2 border-b-1 border-slate-400">
        {/* temporary hardcoding of State Retirement Age because DOB is not available for a SP */}
        {pensionType === PensionType.SP
          ? STATE_RETIREMENT_AGE
          : getRetirementAge(retirementDate, dateOfBirth)}
      </Paragraph>

      <Paragraph className="mb-0 text-gray-400">
        {t('common.estimated-income')}
      </Paragraph>

      <Paragraph className="pb-2 border-b-1 border-slate-400">
        <strong className="mr-2 text-xl">{monthlyAmount}</strong>
        {t('common.a-month')}
      </Paragraph>

      <Link
        asButtonVariant="primary"
        href={`/${locale}/pension-details/${externalAssetId}`}
        data-testid="details-link"
      >
        {t('common.details-link')}
      </Link>
    </InformationCallout>
  );
};
