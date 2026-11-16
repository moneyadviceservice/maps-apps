import { ChangeEvent, useMemo, useState } from 'react';

import {
  costDefaultFrequencies,
  essentialOutgoingsItems,
} from 'data/essentialOutgoingsData';
import {
  summaryResultsCostsChartData,
  summaryTotalOptions,
} from 'data/summaryResultsData';
import {
  DEFAULT_FACTOR,
  FREQUENCY_FACTOR_MAPPING,
  FREQUENCY_KEYS,
  PAGES_NAMES,
  SUMMARY_PROPS,
} from 'lib/constants/pageConstants';
import { calculateIncomeTax } from 'lib/util/summary/income-tax';
import {
  calculateOutcomeRange,
  calculateSummary,
  costBreakdown,
  sumFields,
} from 'lib/util/summaryCalculations/calculations';

import { Heading } from '@maps-react/common/components/Heading';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import useTranslation from '@maps-react/hooks/useTranslation';
import {
  SUMMARY_TOTAL_STATUS_TYPES,
  SummaryTotal,
} from '@maps-react/pension-tools/components/SummaryTotal';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { SummaryCostsChart } from '../SummaryCostsChart/SummaryCostsChart';

type Props = {
  income: Record<string, string>;
  costs: Record<string, string>;
  divider: string;
  tabName: string;
};

export const SummaryBreakdownTotal = ({
  income,
  costs,
  divider,
  tabName,
}: Props) => {
  const { t } = useTranslation();

  const summaryOptions = summaryTotalOptions(t);
  const summaryCostsChartData = summaryResultsCostsChartData({ t });

  const mapFrequencyToValue = (val: string) =>
    FREQUENCY_FACTOR_MAPPING.find((t) => t.key === val)?.value;

  const summary = useMemo(() => {
    const annualIncomeAfterTax = calculateIncomeTax(income);
    const monthlyIncomeAfterTax = annualIncomeAfterTax / 12;
    return {
      [SUMMARY_PROPS.INCOME]: monthlyIncomeAfterTax,
      [SUMMARY_PROPS.SPENDING]: sumFields(
        costs,
        costDefaultFrequencies(),
        'Frequency',
      ),
    };
  }, [income, costs]);

  const initialDefaultFrequency = useMemo(() => {
    let freqKey = summaryOptions[0].value;
    if (divider && tabName === PAGES_NAMES.SUMMARY) {
      freqKey = divider as FREQUENCY_KEYS;
    }
    return freqKey;
  }, []);

  const [divisor, setDivisor] = useState(
    mapFrequencyToValue(initialDefaultFrequency),
  );

  const summaryData = useMemo(
    () => ({
      income: summary.income / (divisor ?? DEFAULT_FACTOR),
      spending: summary.spending / (divisor ?? DEFAULT_FACTOR),
    }),
    [summary, divisor],
  );

  const breakdown = useMemo(
    () => costBreakdown(costs, essentialOutgoingsItems(t), divisor),
    [divisor],
  );

  const handleClickTotalFrequency = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) setDivisor(mapFrequencyToValue(value));
    else setDivisor(DEFAULT_FACTOR);
  };

  return (
    <InformationCallout
      variant="withDominantBorder"
      className="px-2 py-4 space-y-5 border-teal-400 sm:px-4 lg:pb-8"
    >
      <Heading component="h2" level="h2" className="text-blue-700">
        {summaryCostsChartData.title}
      </Heading>
      <Markdown
        content={summaryCostsChartData.description}
        className="text-base"
      />

      <div className="flex flex-col-reverse gap-4 lg:flex-row">
        <SummaryCostsChart
          title={summaryCostsChartData.label}
          items={breakdown}
          summaryData={summaryData}
          className="lg:basis-1/2 xl:basis-7/12 2xl:basis-2/3"
        />
        <SummaryTotal
          data-testid="summary-total"
          title={t('summaryTotal.summaryPageTitle')}
          variant="summary"
          income={summaryData?.income ?? 0}
          spending={summaryData?.spending ?? 0}
          balance={summaryData ? calculateSummary(summaryData) : 0}
          incomeLabel={t('summaryTotal.incomeAfterTax')}
          spendingLabel={t('summaryTotal.spending')}
          balanceLabel={t('summaryTotal.balance')}
          dropDownOptions={summaryOptions}
          defaultSummaryTotal={initialDefaultFrequency}
          onSelectClick={handleClickTotalFrequency}
          buttonText={t('summaryTotal.submitLabel')}
          action={'/api/change-total-factor'}
          status={
            summaryData
              ? calculateOutcomeRange(summaryData)
              : SUMMARY_TOTAL_STATUS_TYPES.BALANCED
          }
          ariaLabels={{
            description: t('summaryTotal.aria.description'),
            statusOverspending: t('summaryTotal.aria.statusOverspending'),
            statusPositive: t('summaryTotal.aria.statusPositive'),
            statusBalanced: t('summaryTotal.aria.statusBalanced'),
            amountSuffix: t('summaryTotal.aria.amountSuffix'),
            selectLabel: t('summaryTotal.aria.selectLabel'),
          }}
          className="border-gray-300 lg:sticky lg:top-4 lg:basis-1/2 xl:basis-5/12 2xl:basis-1/3"
        />
      </div>
    </InformationCallout>
  );
};
