import Image from 'next/image';

import { twMerge } from 'tailwind-merge';

import { H3, Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { NO_DATA, PensionGroup, PensionType } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import { getCalculationType } from '../../lib/utils/data';
import {
  currencyAmount,
  formatDate,
  getPensionTypeClasses,
} from '../../lib/utils/ui';

type PensionDetailIntroProps = {
  data: PensionArrangement | null;
};

export const PensionDetailIntro = ({ data }: PensionDetailIntroProps) => {
  const { t } = useTranslation();

  if (!data) {
    return null;
  }

  const { detailData, pensionType } = data;

  const PensionTypeTitle: Record<string, string> = {
    [PensionType.AVC]: t('pages.pension-details.details.in-this-pension-pot'),
    [PensionType.DB]: t('pages.pension-details.details.you-could-receive'),
    [PensionType.DC]: t('pages.pension-details.details.in-this-pension-pot'),
  };

  const { bgLightClass: backgroundColor, textClass } =
    getPensionTypeClasses(pensionType);

  const {
    benefitType,
    monthlyAmount,
    potValue,
    lumpSumAmount,
    lumpSumPayableDate,
  } = detailData?.standardPayment || {};

  const retirementDate = detailData?.retirementDate
    ? formatDate(detailData?.retirementDate)
    : NO_DATA;

  const calcType = getCalculationType(pensionType, benefitType);

  const amountText = (() => {
    switch (calcType) {
      case PensionType.DB:
        return monthlyAmount
          ? `${currencyAmount(monthlyAmount)} ${t('common.a-month')}`
          : t('common.unavailable');
      case PensionType.DC:
      case PensionType.AVC:
        return potValue ? currencyAmount(potValue) : t('common.unavailable');
      default:
        return t('common.unavailable');
    }
  })();

  // if matchType is SYS or NEW override any unavailable codes
  // otherwise we filter out DB codes and populate with unavailable codes from detailData (if they exist)
  const unavailableCodes =
    data.matchType === 'SYS' || data.matchType === 'NEW'
      ? [`${data.matchType}_MATCHTYPE`]
      : detailData?.unavailableCodes?.filter((code) => code !== 'DB') ?? [];

  const hasMultipleUnavailableCodes = unavailableCodes
    ? unavailableCodes.length > 1
    : false;

  // Take just first code to use later on if hasMultipleUnavailableCodes is false.
  const singleUnavailableCode = unavailableCodes?.[0];

  const hasMonthlyAmount = monthlyAmount && monthlyAmount > 0;
  const hasPotValue = potValue && potValue > 0;

  const summaryContent = (() => {
    if (hasMonthlyAmount) {
      return (
        <Markdown
          disableParagraphs
          content={t(`pages.pension-details.estimate-${calcType}`, {
            income: monthlyAmount
              ? currencyAmount(monthlyAmount)
              : t('common.unavailable'),
            date:
              retirementDate === NO_DATA
                ? t('common.unavailable')
                : retirementDate,
          })}
        />
      );
    } else if (hasMultipleUnavailableCodes) {
      return (
        <Markdown
          disableParagraphs
          content={t(`data.pensions.unavailable-reasons.MULTIPLE`, {
            pensionProvider: data.pensionAdministrator?.name,
          })}
        />
      );
    } else if (singleUnavailableCode) {
      return (
        <Markdown
          disableParagraphs
          content={t(
            `data.pensions.unavailable-reasons.${singleUnavailableCode}`,
            {
              pensionProvider: data.pensionAdministrator?.name,
            },
          )}
        />
      );
    }
  })();

  return (
    <div
      data-testid="pension-detail-intro"
      className={twMerge(
        backgroundColor,
        'p-4 pb-6 md:px-0 md:py-8 rounded-bl-3xl relative mb-6 lg:mb-0',
      )}
    >
      <div className="sm:grid sm:grid-cols-8 sm:gap-4">
        <div className="md:pl-8 sm:col-span-5">
          {calcType && (hasMonthlyAmount || hasPotValue) && (
            <H3 className="mb-4 font-semibold">{PensionTypeTitle[calcType]}</H3>
          )}
          <Heading
            data-testid="amount-text"
            level="h2"
            component="h4"
            color={textClass}
            className="mb-4 md:text-5xl"
          >
            {calcType && (hasMonthlyAmount || hasPotValue)
              ? amountText
              : t('common.unavailable')}
          </Heading>
          {data.group !== PensionGroup.RED && (
            <Paragraph
              data-testid="summary-content"
              className="text-2xl md:text-[1.625rem] leading-[1.5] mb-2"
            >
              {summaryContent}
            </Paragraph>
          )}
          {lumpSumAmount && lumpSumAmount > 0 && (
            <Paragraph
              data-testid="lump-sum-content"
              className="flex mb-4 md:mb-2 text-base leading-[1.65] md:leading-[1.5]"
            >
              <Icon
                type={IconType.LUMP_SUM}
                className={twMerge(
                  'inline -ml-2 mt-2 md:mt-1 mr-2 w-[35px] h-[35px] shrink-0',
                  textClass,
                )}
              />
              <Markdown
                disableParagraphs
                content={t(`pages.pension-details.lump-sum`, {
                  amount: currencyAmount(lumpSumAmount),
                  date: lumpSumPayableDate
                    ? formatDate(lumpSumPayableDate)
                    : NO_DATA,
                })}
              />
            </Paragraph>
          )}
        </div>
        <div className="items-end sm:flex sm:justify-end md:pr-8 sm:col-span-3">
          <Image
            width={288}
            height={169}
            src={`/images/${data.pensionType.toLowerCase()}-illustration.svg`}
            data-testid="pension-image"
            alt=""
            className="max-sm:mt-6 max-w-[225px] sm:max-w-full xl:max-w-[267px] 2xl:max-w-[284px] sm:w-auto ml-auto mt-auto"
          />
        </div>
      </div>
    </div>
  );
};
