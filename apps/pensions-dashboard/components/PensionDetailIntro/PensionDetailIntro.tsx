import Image from 'next/image';

import { twMerge } from 'tailwind-merge';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { BenefitType, NO_DATA, PensionType } from '../../lib/constants';
import { PaymentSummary, PensionArrangement } from '../../lib/types';
import { hasAvailableSummaryValue } from '../../lib/utils/data';
import {
  currencyAmount,
  formatDate,
  getPensionTypeClasses,
} from '../../lib/utils/ui';

type PensionDetailIntroProps = {
  data: PensionArrangement | null;
};

type PaymentSummaryGroup = {
  label: 'standard' | 'legacy' | 'alternative';
  data: PaymentSummary;
};

const UnavailableSummary = ({ data }: { data: PensionArrangement }) => {
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

const SummaryContent = ({
  data,
  hasMonthlyAmount,
  isCashBalanceLump,
  isMcCloud,
  summaryArray,
}: {
  data: PensionArrangement;
  hasMonthlyAmount: boolean;
  isCashBalanceLump: boolean;
  isMcCloud: boolean;
  summaryArray: PaymentSummaryGroup[];
}) => {
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

export const PensionDetailIntro = ({ data }: PensionDetailIntroProps) => {
  const { t, locale } = useTranslation();

  if (!data) {
    return null;
  }

  const { pensionType } = data;

  const { bgLightClass: backgroundColor } = getPensionTypeClasses(pensionType);

  const { standardPayment, legacyPayment, alternativePayment } =
    data.detailData || {};

  const summaryArray: PaymentSummaryGroup[] = [
    ...(standardPayment
      ? [{ label: 'standard' as const, data: standardPayment }]
      : []),
    ...(legacyPayment && alternativePayment
      ? [
          { label: 'legacy' as const, data: legacyPayment },
          { label: 'alternative' as const, data: alternativePayment },
        ]
      : []),
  ];

  const hasMonthlyAmount = summaryArray.some(
    (payment) => payment.data.monthlyAmount && payment.data.monthlyAmount > 0,
  );

  // if there are legacy and alternative payments, and a monthly amount
  // get the earliest payment date from either legacy or alternative
  const earliestMcCloudPaymentDate =
    !standardPayment && hasMonthlyAmount
      ? summaryArray.reduce((earliest, payment) => {
          const paymentDate = payment.data.payableDate;
          if (paymentDate) {
            if (!earliest || new Date(paymentDate) < new Date(earliest)) {
              return paymentDate;
            }
          }
          return earliest;
        }, undefined as string | undefined)
      : undefined;

  const mcCloudRetirementDate = earliestMcCloudPaymentDate
    ? formatDate(earliestMcCloudPaymentDate, locale)
    : NO_DATA;

  const isMcCloud = summaryArray.some((item) => item.label !== 'standard');

  const isCashBalanceLump =
    pensionType === PensionType.CB &&
    standardPayment?.benefitType === BenefitType.CBL &&
    !!standardPayment?.lumpSumAmount &&
    standardPayment.lumpSumAmount > 0;

  return (
    <div
      data-testid="pension-detail-intro"
      className={twMerge(
        backgroundColor,
        'p-4 pb-6 md:px-0 md:py-8 rounded-bl-3xl relative mb-6 lg:mb-0',
      )}
    >
      <div className="sm:grid sm:grid-cols-8 sm:gap-4">
        <div
          className={twMerge(
            'md:pl-8 sm:col-span-5',
            isMcCloud && hasMonthlyAmount && 'sm:col-span-8',
          )}
        >
          {hasAvailableSummaryValue(data) ? (
            <SummaryContent
              data={data}
              hasMonthlyAmount={hasMonthlyAmount}
              isCashBalanceLump={isCashBalanceLump}
              isMcCloud={isMcCloud}
              summaryArray={summaryArray}
            />
          ) : (
            <UnavailableSummary data={data} />
          )}

          {hasMonthlyAmount && isMcCloud && (
            <Markdown
              testId="summary-content"
              className="text-2xl md:text-[1.625rem] leading-[1.5] mt-6"
              content={t(`pages.pension-details.estimate`, {
                date:
                  mcCloudRetirementDate === NO_DATA
                    ? t('common.unavailable')
                    : mcCloudRetirementDate,
              })}
            />
          )}
        </div>

        {!(isMcCloud && hasMonthlyAmount) && (
          <div className="items-end sm:flex sm:justify-end md:pr-8 sm:col-span-3">
            {data.pensionType && (
              <Image
                width={288}
                height={169}
                src={`/images/${data.pensionType.toLowerCase()}-illustration.svg`}
                data-testid="pension-image"
                alt=""
                className="max-sm:mt-6 max-w-[225px] sm:max-w-full xl:max-w-[267px] 2xl:max-w-[284px] sm:w-auto ml-auto mt-auto"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
