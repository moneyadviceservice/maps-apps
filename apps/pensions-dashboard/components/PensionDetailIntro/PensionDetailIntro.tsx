import Image from 'next/image';

import { twMerge } from 'tailwind-merge';

import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { NO_DATA } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import {
  hasAvailableSummaryValue,
  isCashBalanceLumpSum,
} from '../../lib/utils/data';
import { formatDate, getPensionTypeClasses } from '../../lib/utils/ui';
import {
  PaymentSummaryGroup,
  SummaryContent,
  UnavailableSummary,
} from './PensionDetailIntroSummary';

type PensionDetailIntroProps = {
  data: PensionArrangement | null;
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

  const isCashBalanceLump = isCashBalanceLumpSum(data);

  const noUnavailableCodeSent =
    data.matchType !== 'SYS' &&
    data.matchType !== 'NEW' &&
    (data.detailData?.unavailableCodes?.length ?? 0) === 0;

  const showFullWidthIllustration =
    !hasAvailableSummaryValue(data) && noUnavailableCodeSent;

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
            <UnavailableSummary
              data={data}
              noUnavailableCodeSent={noUnavailableCodeSent}
            />
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
                className={twMerge(
                  'max-sm:mt-6 sm:max-w-full xl:max-w-[267px] 2xl:max-w-[284px] sm:w-auto mt-auto',
                  showFullWidthIllustration
                    ? 'w-full max-w-full h-auto sm:ml-auto sm:w-auto sm:h-auto'
                    : 'max-w-[225px] ml-auto',
                )}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
