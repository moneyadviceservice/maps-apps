import { useSummaryContext } from 'context/SummaryContextProvider/SummaryContextProvider';
import { SummaryType } from 'lib/types/summary.type';
import {
  calculateOutcomeRange,
  calculateSummary,
} from 'lib/util/summaryCalculations/calculations';

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

  return (
    <div className="basis-4/12 md:mt-14">
      <SummaryTotal
        data-testid="summary-total"
        title={t('summaryTotal.title')}
        income={finalSummary?.income ?? 0}
        spending={finalSummary?.spending ?? 0}
        balance={finalSummary ? calculateSummary(finalSummary) : 0}
        incomeLabel={t('summaryTotal.income')}
        spendingLabel={t('summaryTotal.spending')}
        balanceLabel={t('summaryTotal.balance')}
        status={
          finalSummary
            ? calculateOutcomeRange(finalSummary)
            : SUMMARY_TOTAL_STATUS_TYPES.BALANCED
        }
      />
    </div>
  );
};
