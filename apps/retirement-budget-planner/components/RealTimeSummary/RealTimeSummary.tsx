import { useSummaryContext } from 'context/SummaryContextProvider/SummaryContextProvider';
import { SummaryType } from 'lib/types/summary.type';
import {
  calculateOutcomeRange,
  calculateSummary,
} from 'lib/util/summaryCalculations/calculations';

import {
  SUMMARY_STATUS,
  useSummaryAnnouncements,
} from '@maps-react/hooks/useSummaryAnnouncements';
import useTranslation from '@maps-react/hooks/useTranslation';
import {
  SUMMARY_TOTAL_STATUS_TYPES,
  SummaryTotal,
} from '@maps-react/pension-tools/components/SummaryTotal';

type Props = {
  summaryData: SummaryType | undefined;
};

export const RealTimeSummary = ({ summaryData }: Props) => {
  const { t } = useTranslation();
  const { summary } = useSummaryContext();

  const isSummaryCached =
    summary &&
    (Object.keys(summary) as Array<keyof SummaryType>).some(
      (key) => summary[key] > 0,
    );

  const finalSummary = isSummaryCached ? summary : summaryData;
  const income = finalSummary?.income ?? 0;
  const spending = finalSummary?.spending ?? 0;
  const balance = finalSummary ? calculateSummary(finalSummary) : 0;
  const status = finalSummary
    ? calculateOutcomeRange(finalSummary)
    : SUMMARY_TOTAL_STATUS_TYPES.BALANCED;

  const announcementStatus =
    status === SUMMARY_TOTAL_STATUS_TYPES.POSITIVE
      ? SUMMARY_STATUS.POSITIVE
      : status === SUMMARY_TOTAL_STATUS_TYPES.NEGATIVE
      ? SUMMARY_STATUS.NEGATIVE
      : SUMMARY_STATUS.BALANCED;

  const { announcement, initialAnnouncement } = useSummaryAnnouncements({
    income,
    spending,
    balance,
    status: announcementStatus,
    t,
  });

  return (
    <div className="basis-4/12">
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        data-testid="summary-announcement"
      >
        {announcement}
      </div>

      <noscript>
        <div className="sr-only" data-testid="summary-announcement-nojs">
          {initialAnnouncement}
        </div>
      </noscript>

      <SummaryTotal
        data-testid="summary-total"
        title={t('summaryTotal.title')}
        variant="realTime"
        titleWithFrequency={t('summaryTotal.titleWithFrequency')}
        income={income}
        spending={spending}
        balance={balance}
        incomeLabel={t('summaryTotal.income')}
        spendingLabel={t('summaryTotal.spending')}
        balanceLabel={t('summaryTotal.balance')}
        status={status}
        ariaLabels={{
          description: t('summaryTotal.aria.description'),
          statusOverspending: t('summaryTotal.aria.statusOverspending'),
          statusPositive: t('summaryTotal.aria.statusPositive'),
          statusBalanced: t('summaryTotal.aria.statusBalanced'),
          amountSuffix: t('summaryTotal.aria.amountSuffix'),
        }}
        className="border-gray-300 md:sticky md:top-4"
      />
    </div>
  );
};
