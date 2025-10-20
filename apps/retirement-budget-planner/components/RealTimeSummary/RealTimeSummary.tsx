import { useSummaryContext } from 'context/SummaryContextProvider/SummaryContextProvider';
import { SummaryType } from 'lib/types/summary.type';
import {
  calculateOutcomeRange,
  calculateSummary,
} from 'lib/util/summaryCalculations/calculations';

import useTranslation from '@maps-react/hooks/useTranslation';
import { SummaryTotal } from '@maps-react/pension-tools/components/SummaryTotal';

type Props = {
  summaryData: SummaryType | undefined;
};

export const RealTimeSummary = ({ summaryData }: Props) => {
  const { t } = useTranslation();
  const { summary } = useSummaryContext();

  const isSummaryCached =
    summaryData &&
    (Object.keys(summaryData) as Array<keyof SummaryType>).some(
      (key) => summaryData[key] > 0,
    );

  const finalSummary = isSummaryCached ? summaryData : summary;

  return (
    <div className="basis-4/12 md:mt-14">
      <SummaryTotal
        data-testid="summary-total"
        title={t('summaryTotal.title')}
        income={finalSummary.income}
        spending={finalSummary.spending}
        balance={calculateSummary(finalSummary)}
        incomeLabel={t('summaryTotal.income')}
        spendingLabel={t('summaryTotal.spending')}
        balanceLabel={t('summaryTotal.balance')}
        status={calculateOutcomeRange(finalSummary)}
      />
    </div>
  );
};
