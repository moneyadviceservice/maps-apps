import Image from 'next/image';

import { twMerge } from 'tailwind-merge';

import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

import { NO_DATA, PensionsCardType, PensionType } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import {
  filterUnavailableCode,
  getLatestEmployment,
  getRetirementDate,
  processBenefitIllustrations,
} from '../../lib/utils';
import hmLogo from '../../public/images/hm-gov-logo.png';
import { PensionStatus } from '../PensionStatus';

type PensionsCardProps = {
  data: PensionArrangement;
  type?: PensionsCardType;
};

export const PensionsCard = ({
  data,
  type = PensionsCardType.CONFIRMED,
}: PensionsCardProps) => {
  const { t, locale } = useTranslation();
  const {
    schemeName,
    employmentMembershipPeriods,
    pensionAdministrator: { name },
    externalAssetId,
    pensionType,
    benefitIllustrations,
    matchType,
    pensionAdministrator,
  } = data;

  const { monthlyAmount, unavailableCode } =
    processBenefitIllustrations(benefitIllustrations);

  const employmentPeriod = employmentMembershipPeriods
    ? getLatestEmployment(employmentMembershipPeriods)
    : null;

  const retirementDate = getRetirementDate(data);

  const PensionTypeBorders: Record<string, string> = {
    [PensionType.SP]: 'border-blue-800',
    [PensionType.DB]: 'border-purple-700',
    [PensionType.DC]: 'border-teal-400',
  };

  const PensionTypeBg: Record<string, string> = {
    [PensionType.SP]: 'bg-blue-800',
    [PensionType.DB]: 'bg-purple-700',
    [PensionType.DC]: 'bg-teal-400',
  };

  const PensionTypeIcon: Record<string, IconType> = {
    [PensionType.DB]: IconType.DEFINED_BENEFIT,
    [PensionType.DC]: IconType.DEFINED_CONTRIBUTION,
  };

  const borderClass = PensionTypeBorders[pensionType];
  const backgroundClass = PensionTypeBg[pensionType];
  const showPensionTypeIcon = [PensionType.DC, PensionType.DB].includes(
    pensionType,
  );

  return (
    <InformationCallout
      className={twMerge(pensionType && borderClass, 'border-2')}
    >
      {pensionType && (
        <Heading
          color={twMerge('text-white', backgroundClass)}
          level="h3"
          className="flex items-center px-6 pt-1 pb-2 mb-0 text-base font-normal tracking-[0.01125rem] md:text-base"
          data-testid="pension-card-type"
        >
          {showPensionTypeIcon && (
            <Icon
              className="w-[16px] h-[16px] mr-2"
              type={PensionTypeIcon[pensionType]}
            />
          )}
          {t(`components.pension-card.type.${pensionType}`)}
        </Heading>
      )}
      <div className="px-6 pt-5 pb-7">
        <Heading
          color="text-blue-800"
          level="h4"
          className="flex gap-2 my-0 items-top"
          data-testid="pension-card-scheme-name"
        >
          {schemeName}
        </Heading>

        {pensionType !== PensionType.SP && data.pensionStatus && (
          <div
            className="pb-2 pl-1 mt-2 border-b-1 border-slate-400"
            data-testid="pension-card-status"
          >
            <PensionStatus data={data} showShortText={true} />
          </div>
        )}

        {pensionType !== PensionType.SP && (
          <>
            <Paragraph className="mt-2 mb-0 text-gray-400">
              {t('common.provider')}:
            </Paragraph>
            <Paragraph
              className="pb-2 mb-2 border-b-1 border-slate-400"
              data-testid="pension-card-administrator-name"
            >
              {pensionAdministrator.name}
            </Paragraph>
          </>
        )}

        {pensionType === PensionType.SP && (
          <div className="pb-4 mt-4 border-b-1 border-slate-400">
            <Image
              src={hmLogo}
              alt={t('site.hm-gov-logo-alt')}
              width={188}
              height={28}
            />
          </div>
        )}

        {employmentPeriod && (
          <>
            <Paragraph className="mt-2 mb-0 text-gray-400">
              {t('common.employer')}:
            </Paragraph>
            <Paragraph
              className="pb-2 mb-2 border-b-1 border-slate-400"
              data-testid="pension-card-employer-name"
            >
              {employmentPeriod.employerName}
            </Paragraph>
          </>
        )}

        {type !== PensionsCardType.CONFIRMED_NO_INCOME &&
          retirementDate !== NO_DATA && (
            <>
              <Paragraph className="mt-2 mb-0 text-gray-400">
                {t('common.retirement-date')}:
              </Paragraph>

              <Paragraph
                data-testid="pension-card-retirement-date"
                className="pb-2 mb-2 border-b-1 border-slate-400"
              >
                {getRetirementDate(data)}
              </Paragraph>
            </>
          )}

        {type !== PensionsCardType.CONFIRMED && (
          <div className="flex gap-3 my-5">
            <Icon
              className="w-[30px] h-[30px] shrink-0 fill-gray-800"
              fill="true"
              type={IconType.WARNING_SQUARE}
            />
            <Paragraph
              className="mb-0 text-gray-400"
              data-testid="pension-card-unavailable-reason"
            >
              {t(
                `data.pensions.unavailable-reasons.${filterUnavailableCode(
                  matchType,
                  unavailableCode,
                )}`,
                {
                  pensionProvider: name,
                },
              )}
            </Paragraph>
          </div>
        )}

        {type === PensionsCardType.CONFIRMED && (
          <>
            <Paragraph className="mt-2 mb-0 text-gray-400">
              {t('common.estimated-income')}:
            </Paragraph>

            <Paragraph
              className="pb-2 border-b-1 border-slate-400"
              data-testid="pension-card-monthly-amount"
            >
              <strong className="mr-2 text-[24px]">{monthlyAmount}</strong>
              {t('common.a-month')}
            </Paragraph>
          </>
        )}

        <Link
          asButtonVariant="primary"
          href={`/${locale}/pension-details/${externalAssetId}`}
          data-testid="details-link"
        >
          {t('common.details-link')}
        </Link>
      </div>
    </InformationCallout>
  );
};
