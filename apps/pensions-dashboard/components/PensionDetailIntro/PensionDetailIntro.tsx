import Image from 'next/image';

import { twMerge } from 'tailwind-merge';

import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import {
  IllustrationType,
  NO_DATA,
  PensionGroup,
  PensionType,
} from '../../lib/constants';
import { LumpSumDetails, PensionArrangement } from '../../lib/types';
import {
  currencyAmount,
  filterUnavailableCode,
  formatDate,
  getLatestIllustration,
  getLumpSumIllustration,
  getMonthlyAmount,
  getMostRecentBenefitIllustration,
  getPotValue,
  getRetirementDate,
} from '../../lib/utils';

type PensionDetailIntroProps = {
  data: PensionArrangement | null;
  unavailableCode?: string;
};

export const PensionDetailIntro = ({
  data,
  unavailableCode,
}: PensionDetailIntroProps) => {
  const { t } = useTranslation();

  if (!data) {
    return null;
  }
  const benefitIllustrations = data.benefitIllustrations;
  const latest = getMostRecentBenefitIllustration(benefitIllustrations);
  const eriIllustration = getLatestIllustration(IllustrationType.ERI, data);
  const eriIllustrationLumpSum = getLumpSumIllustration(
    IllustrationType.ERI,
    benefitIllustrations,
  );

  const noEstimateReasonMessage = (
    <Markdown
      disableParagraphs
      content={t(
        `data.pensions.unavailable-reasons.${filterUnavailableCode(
          data.matchType,
          unavailableCode,
        )}`,
        {
          pensionProvider: data.pensionAdministrator?.name,
        },
      )}
    />
  );

  const PensionTypeBg: Record<string, string> = {
    [PensionType.DB]: 'bg-purple-100',
    [PensionType.DC]: 'bg-teal-100',
  };

  const PensionTypeTitle: Record<string, string> = {
    [PensionType.DB]: t('pages.pension-details.details.you-could-receive'),
    [PensionType.DC]: t('pages.pension-details.details.in-this-pension-pot'),
  };

  const PensionTypeColor: Record<string, string> = {
    [PensionType.DB]: 'text-purple-650',
    [PensionType.DC]: 'text-teal-700',
  };

  const backgroundColor = PensionTypeBg[data.pensionType];

  const retirementDate = getRetirementDate(data);

  const amountText = (() => {
    switch (data.pensionType) {
      case PensionType.DB:
        return getMonthlyAmount(eriIllustration)
          ? `${getMonthlyAmount(eriIllustration)} ${t('common.a-month')}`
          : `£ ${t('common.no-data')}`;
      case PensionType.DC:
        return getPotValue(latest, IllustrationType.AP)
          ? getPotValue(latest, IllustrationType.AP)
          : `£ ${t('common.no-data')}`;
      default:
        return `£ ${t('common.no-data')}`;
    }
  })();

  const summaryContent = (() => {
    switch (data.group) {
      case PensionGroup.GREEN:
        return (
          <Markdown
            disableParagraphs
            content={t(`pages.pension-details.estimate-${data.pensionType}`, {
              income:
                getMonthlyAmount(eriIllustration) ?? `£ ${t('common.no-data')}`,
              date:
                retirementDate !== NO_DATA
                  ? retirementDate
                  : t('common.no-data'),
            })}
          />
        );

      case PensionGroup.GREEN_NO_INCOME:
      case PensionGroup.YELLOW:
        return noEstimateReasonMessage;
      default:
        return null;
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
          <Heading
            level="h2"
            component="h3"
            className="mb-4 font-semibold max-sm:text-2xl"
          >
            {PensionTypeTitle[data.pensionType]}
          </Heading>
          <Heading
            data-testid="amount-text"
            level="h2"
            component="h4"
            color={PensionTypeColor[data.pensionType]}
            className="mb-4 md:text-5xl"
          >
            {amountText}
          </Heading>
          {summaryContent && (
            <Paragraph
              data-testid="summary-content"
              className="text-2xl leading-[1.75] mb-2"
            >
              {summaryContent}
            </Paragraph>
          )}
          {eriIllustrationLumpSum && (
            <Paragraph
              data-testid="lump-sum-content"
              className="flex mb-4 md:mb-2 text-base leading-[1.65] md:leading-[1.5]"
            >
              <Icon
                type={IconType.LUMP_SUM}
                className="inline mt-2 md:mt-1 mr-3 w-[26px] h-[31px] shrink-0 text-purple-650"
              />
              <Markdown
                disableParagraphs
                content={t(`pages.pension-details.lump-sum`, {
                  amount: currencyAmount(
                    (eriIllustrationLumpSum.payableDetails as LumpSumDetails)
                      .amount,
                  ),
                  date: formatDate(
                    eriIllustrationLumpSum.payableDetails.payableDate,
                  ),
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
            className="w-[124px] h-[90px] sm:w-auto sm:h-auto sm:max-w-[240px] sm:max-h-[178px] ml-auto mt-auto"
          />
        </div>
      </div>
    </div>
  );
};
