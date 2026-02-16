import Image from 'next/image';

import { twMerge } from 'tailwind-merge';

import { H3, Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { NO_DATA, PensionGroup, PensionType } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import {
  filterUnavailableCode,
  getCalculationType,
} from '../../lib/utils/data';
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
  const { detailData } = data;

  const PensionTypeTitle: Record<string, string> = {
    [PensionType.AVC]: t('pages.pension-details.details.in-this-pension-pot'),
    [PensionType.DB]: t('pages.pension-details.details.you-could-receive'),
    [PensionType.DC]: t('pages.pension-details.details.in-this-pension-pot'),
  };

  const { bgLightClass: backgroundColor, textClass } = getPensionTypeClasses(
    data.pensionType,
  );

  const retirementDate = detailData?.retirementDate
    ? formatDate(detailData?.retirementDate)
    : NO_DATA;

  const calcType = getCalculationType(
    data.pensionType,
    detailData?.benefitType,
  );

  const amountText = (() => {
    switch (calcType) {
      case PensionType.DB:
        return detailData?.monthlyAmount
          ? `${currencyAmount(detailData.monthlyAmount)} ${t('common.a-month')}`
          : t('common.unavailable');
      case PensionType.DC:
      case PensionType.AVC:
        return detailData?.potValue
          ? currencyAmount(detailData?.potValue)
          : t('common.unavailable');
      default:
        return t('common.unavailable');
    }
  })();

  // include SYS and NEW match types
  const filteredUnavailableCode = filterUnavailableCode(
    data.matchType,
    detailData?.unavailableCode,
  );

  const summaryContent = (() => {
    if (
      filteredUnavailableCode &&
      !(calcType === PensionType.DB && filteredUnavailableCode === 'DB')
    ) {
      return (
        <Markdown
          disableParagraphs
          content={t(
            `data.pensions.unavailable-reasons.${filteredUnavailableCode}`,
            {
              pensionProvider: data.pensionAdministrator?.name,
            },
          )}
        />
      );
    } else if (calcType) {
      return (
        <Markdown
          disableParagraphs
          content={t(`pages.pension-details.estimate-${calcType}`, {
            income: detailData?.monthlyAmount
              ? currencyAmount(detailData?.monthlyAmount)
              : t('common.unavailable'),
            date:
              retirementDate === NO_DATA
                ? t('common.unavailable')
                : retirementDate,
          })}
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
          {calcType && (
            <H3 className="mb-4 font-semibold">{PensionTypeTitle[calcType]}</H3>
          )}
          <Heading
            data-testid="amount-text"
            level="h2"
            component="h4"
            color={textClass}
            className="mb-4 md:text-5xl"
          >
            {amountText}
          </Heading>
          {data.group !== PensionGroup.RED && (
            <Paragraph
              data-testid="summary-content"
              className="text-2xl md:text-[1.625rem] leading-[1.5] mb-2"
            >
              {summaryContent}
            </Paragraph>
          )}
          {detailData?.lumpSumAmount !== undefined && (
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
                  amount: currencyAmount(detailData?.lumpSumAmount),
                  date: detailData?.lumpSumPayableDate
                    ? formatDate(detailData?.lumpSumPayableDate)
                    : NO_DATA,
                })}
              />
            </Paragraph>
          )}
        </div>
        <div className="items-end sm:flex sm:justify-end md:pr-8 sm:col-span-3">
          <Image
            width={240}
            height={178}
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
