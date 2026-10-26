import { twMerge } from 'tailwind-merge';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { NO_DATA } from '../../lib/constants';
import { PaymentSummary, PensionArrangement } from '../../lib/types';
import {
  currencyAmount,
  formatDate,
  getPensionTypeClasses,
} from '../../lib/utils/ui';

export type PaymentSummaryGroup = {
  label: 'standard' | 'legacy' | 'alternative';
  data: PaymentSummary;
};

type UnavailableSummaryProps = {
  data: PensionArrangement;
  noUnavailableCodeSent: boolean;
};

export const UnavailableSummary = ({
  data,
  noUnavailableCodeSent,
}: UnavailableSummaryProps) => {
  const { t } = useTranslation();

  const { detailData } = data;

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

  if (noUnavailableCodeSent) {
    return (
      <div data-testid="summary-content">
        <Markdown
          className="text-2xl md:text-[1.625rem] leading-[1.5] mb-4 last:mb-2"
          content={t('data/unavailable-reasons.NO_ESTIMATED_VALUE')}
        />
      </div>
    );
  }

  return (
    <Paragraph
      data-testid="summary-content"
      className="text-2xl md:text-[1.625rem] leading-[1.5] mb-2"
    >
      {hasMultipleUnavailableCodes && (
        <Markdown
          disableParagraphs
          content={t(`data/unavailable-reasons.MULTIPLE`, {
            pensionProvider: data.pensionAdministrator?.name,
          })}
        />
      )}
      {singleUnavailableCode && !hasMultipleUnavailableCodes && (
        <Markdown
          disableParagraphs
          content={t(`data/unavailable-reasons.${singleUnavailableCode}`, {
            pensionProvider: data.pensionAdministrator?.name,
          })}
        />
      )}
    </Paragraph>
  );
};

type SummaryContentProps = {
  data: PensionArrangement;
  hasMonthlyAmount: boolean;
  isCashBalanceLump: boolean;
  isMcCloud: boolean;
  summaryArray: PaymentSummaryGroup[];
};

export const SummaryContent = ({
  data,
  hasMonthlyAmount,
  isCashBalanceLump,
  isMcCloud,
  summaryArray,
}: SummaryContentProps) => {
  const { t, locale } = useTranslation();
  const { pensionType, detailData } = data;
  const { textClass, borderClass } = getPensionTypeClasses(pensionType);

  const retirementDate = detailData?.retirementDate
    ? formatDate(detailData?.retirementDate, locale)
    : NO_DATA;

  return (
    <Paragraph className="mb-0">
      {hasMonthlyAmount && (
        <span className="block mb-4 text-2xl font-semibold text-gray-800 md:text-4xl">
          {`${t('pages.pension-details.details.you-could-receive')} `}
        </span>
      )}

      {isCashBalanceLump && (
        <span className="block mb-4 text-2xl font-semibold text-gray-800 md:text-4xl">
          {`${t('pages.pension-details.details.cash-balance-you-could-have')} `}
        </span>
      )}

      {summaryArray.map((payment, idx) => {
        const amountToUse = isCashBalanceLump
          ? payment.data.lumpSumAmount
          : payment.data.monthlyAmount;

        return (
          <span
            className={twMerge(
              isMcCloud &&
                `border-l-4 pl-3 pb-1 md:pl-5 mt-10 md:mt-10 ${borderClass}`,
              idx !== 0 && 'mt-6 md:mt-12',
              'block',
            )}
            key={idx}
          >
            {isMcCloud && (
              <span className="block mb-0 text-xl font-bold md:mb-2 md:text-2xl">
                {t(`components.income-timeline.${payment.label}`)}{' '}
                {t('components.income-timeline.option')}{' '}
              </span>
            )}

            <span
              data-testid="amount-text"
              className={twMerge(
                'text-3xl mb-4 md:text-5xl block font-bold',
                isMcCloud && 'mb-2 md:mb-4',
                textClass,
              )}
            >
              {amountToUse
                ? `${currencyAmount(amountToUse)} ${
                    isCashBalanceLump ? '' : t('common.a-month')
                  } `
                : t('common.unavailable')}
            </span>

            {!isMcCloud && (
              <Markdown
                testId="summary-content"
                key={idx}
                disableParagraphs
                className="break-words text-2xl md:text-[1.625rem] leading-[1.5] mb-2 block"
                content={t(
                  isCashBalanceLump
                    ? 'pages.pension-details.estimate-cash-balance'
                    : `pages.pension-details.estimate`,
                  {
                    date:
                      retirementDate === NO_DATA
                        ? t('common.unavailable')
                        : retirementDate,
                  },
                )}
              />
            )}

            {!isCashBalanceLump &&
              payment.data.lumpSumAmount &&
              payment.data.lumpSumAmount > 0 && (
                <span
                  data-testid="lump-sum-content"
                  className="flex mb-2 text-base leading-[1.5] items-start"
                >
                  <Icon
                    type={IconType.LUMP_SUM}
                    className={twMerge(
                      'inline -ml-2 mt-2 md:mt-1 mr-2 w-[35px] h-[35px] shrink-0',
                      textClass,
                    )}
                  />
                  <Markdown
                    className="mt-2"
                    disableParagraphs
                    content={t(`pages.pension-details.lump-sum`, {
                      amount: currencyAmount(payment.data.lumpSumAmount),
                    })}
                  />{' '}
                </span>
              )}
          </span>
        );
      })}
    </Paragraph>
  );
};
