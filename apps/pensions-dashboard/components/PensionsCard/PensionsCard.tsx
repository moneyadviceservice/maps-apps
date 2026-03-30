import Image from 'next/image';

import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { NO_DATA, PensionsCardType, PensionType } from '../../lib/constants';
import { CardData, PensionArrangement } from '../../lib/types';
import {
  filterUnavailableCode,
  filterValidEmploymentPeriods,
  getLatestEmployment,
} from '../../lib/utils/data';
import {
  currencyAmount,
  formatDate,
  getPensionTypeClasses,
} from '../../lib/utils/ui';
import hmLogo from '../../public/images/hm-gov-logo.png';
import { PensionCardRow } from '../PensionCardRow';
import { PensionStatus } from '../PensionStatus';

type PensionsCardProps = {
  data: PensionArrangement & { cardData?: CardData };
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
    cardData,
  } = data;

  const monthlyAmount = cardData?.monthlyAmount
    ? currencyAmount(cardData?.monthlyAmount)
    : NO_DATA;

  const employmentPeriods = filterValidEmploymentPeriods(
    employmentMembershipPeriods,
  );

  const employmentPeriod = getLatestEmployment(employmentPeriods);

  const PensionTypeIcon: Record<string, IconType> = {
    [PensionType.AVC]: IconType.AVC,
    [PensionType.HYB]: IconType.HYBRID,
    [PensionType.DB]: IconType.DEFINED_BENEFIT,
    [PensionType.DC]: IconType.DEFINED_CONTRIBUTION,
    [PensionType.SP]: IconType.STATE_PENSION,
  };

  const { borderClass, bgDarkClass: backgroundClass } =
    getPensionTypeClasses(pensionType);
  const showPensionStatus =
    pensionType !== PensionType.SP && data.pensionStatus;
  const hasLinkedPensions =
    data?.linkedPensions && data.linkedPensions?.length > 0;
  data.linkedPensions?.sort((a, b) => a.schemeName.localeCompare(b.schemeName));

  // include SYS and NEW match types
  const unavailableCode = filterUnavailableCode(
    data.matchType,
    cardData?.unavailableReason,
  );

  return (
    <InformationCallout
      className={twMerge(pensionType && borderClass, 'border-2')}
    >
      {pensionType && (
        <Heading
          color={twMerge('text-white', backgroundClass)}
          level="h3"
          className="flex items-center px-2 md:px-5 pt-1 pb-2 mb-0 text-base font-normal tracking-[0.01125rem] md:text-base"
          data-testid="pension-card-type"
        >
          <Icon
            className="w-[24px] h-[24px] mr-2 flex-shrink-0"
            type={PensionTypeIcon[pensionType]}
          />
          <span className="min-w-0 break-words">
            {t(`components.pension-card.type.${pensionType}`)}
          </span>
        </Heading>
      )}

      <div className="px-4 pt-4 md:pt-5 md:px-6 pb-7">
        <Heading
          color="text-blue-700"
          level="h4"
          className="my-0 break-words"
          data-testid="pension-card-scheme-name"
        >
          {schemeName}
        </Heading>

        {(showPensionStatus || hasLinkedPensions) && (
          <div className="pb-2 mt-2 border-b-1 border-slate-400">
            {showPensionStatus && (
              <div className="pl-1" data-testid="pension-card-status">
                <PensionStatus data={data} />
              </div>
            )}

            {hasLinkedPensions && (
              <div className="mt-2" data-testid="pension-card-linked-pensions">
                <Paragraph
                  data-testid="pension-card-linked-pensions-label"
                  className="flex items-center mb-0 text-gray-650"
                >
                  <Icon
                    className="w-[24px] h-[24px] mr-2 mb-1"
                    type={IconType.LINKED_PENSION}
                  />
                  {data.linkedPensions?.length === 1
                    ? t('common.linked-pension')
                    : t('common.linked-pensions')}
                  :
                </Paragraph>
                <ul className="mb-1">
                  {data.linkedPensions?.map((linkedPension) => (
                    <li
                      key={linkedPension.externalAssetId}
                      className="mt-2 text-gray-800 break-words leading-[1.6]"
                      data-testid="pension-card-linked-pension"
                    >
                      {linkedPension.schemeName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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

        <dl className="mt-2">
          {pensionType !== PensionType.SP && (
            <PensionCardRow
              term={`${t('common.provider')}:`}
              description={name}
              testId="pension-card-administrator-name"
            />
          )}

          {employmentPeriod && (
            <PensionCardRow
              term={`${t('common.employer')}:`}
              description={employmentPeriod.employerName}
              testId="pension-card-employer-name"
            />
          )}

          {cardData?.retirementDate && (
            <PensionCardRow
              term={
                pensionType === PensionType.SP
                  ? `${t('common.state-pension-date')}:`
                  : `${t('common.retirement-date')}:`
              }
              description={formatDate(cardData.retirementDate)}
              testId="pension-card-retirement-date"
            />
          )}

          {type === PensionsCardType.CONFIRMED_NO_INCOME && unavailableCode && (
            <>
              <dt className="sr-only">{t('common.unavailable-reason')}:</dt>
              <dd className="flex gap-3 my-5">
                <Icon
                  className="w-[30px] h-[30px] shrink-0 fill-gray-800"
                  fill="true"
                  type={IconType.WARNING_SQUARE}
                />
                <Paragraph
                  className="mb-0 text-gray-650"
                  data-testid="pension-card-unavailable-reason"
                >
                  <Markdown
                    disableParagraphs
                    content={t(
                      `data.pensions.unavailable-reasons.${unavailableCode}`,
                      {
                        pensionProvider: name,
                      },
                    )}
                  />
                </Paragraph>
              </dd>
            </>
          )}

          {type === PensionsCardType.PENDING && (
            <PensionCardRow
              term={`${t('common.expected-income-at-retirement')}:`}
              description={
                <span className="font-bold">{t('common.pending')}</span>
              }
              testId="pension-card-expected-income"
            />
          )}

          {type === PensionsCardType.CONFIRMED && (
            <PensionCardRow
              term={`${t('common.estimated-income')}:`}
              description={
                <>
                  <strong className="mr-2 text-[24px]">{monthlyAmount}</strong>
                  {t('common.a-month')}
                </>
              }
              testId="pension-card-monthly-amount"
            />
          )}
        </dl>

        <form method="POST" className="mt-4">
          <input type="hidden" name="pensionId" value={externalAssetId} />
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="pensionType" value={pensionType} />
          <Button
            className="w-full md:w-auto"
            formAction="/api/set-pension-id"
            data-testid="details-link"
          >
            {t('common.details-link')}
          </Button>
        </form>
      </div>
    </InformationCallout>
  );
};
