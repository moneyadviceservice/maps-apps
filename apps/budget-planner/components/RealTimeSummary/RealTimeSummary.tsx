import { useMemo, useState } from 'react';

import NumberFormat from '@maps-react/common/components/NumberFormat';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import tabs from '../../data/budget-planner';
import calculateBreakdown from '../../utils/calculateBreakdown';
import calculateSummary, {
  calculateOutcomeRange,
} from '../../utils/calculateSummary';
import SummaryTotal from '../SummaryTotal/SummaryTotal';

export type Props = {
  data: { [key: string]: Record<string, string> };
  ariaLive?: 'off' | 'assertive' | 'polite';
};

export const RealTimeSummary = ({ data, ariaLive }: Props) => {
  const { z } = useTranslation();

  const [divisor] = useState(Number(data['summary']?.['divisor']) || 1);

  const breakdown = useMemo(
    () => tabs.reduce(calculateBreakdown(data, divisor), []),
    [data, divisor],
  );

  const summary = useMemo(
    () =>
      breakdown.reduce(calculateSummary, {
        income: 0,
        spending: 0,
      }),
    [breakdown],
  );
  const { income, spending } = summary;
  const severity = useMemo(() => {
    return calculateOutcomeRange(summary);
  }, [summary]);
  const total = useMemo(() => income + spending, [income, spending]);
  const summaryText = useMemo(() => {
    if (severity === 'positive') {
      return { en: 'Spare cash', cy: "Arian sy'n weddill" };
    }
    if (severity === 'negative') {
      return { en: 'Overspend', cy: 'Gorwariant' };
    }
    return { en: 'Balance', cy: 'Balans' };
  }, [severity]);
  const background = useMemo(() => {
    if (severity === 'positive') {
      return 'bg-green-700';
    }
    if (severity === 'negative') {
      return 'bg-red-600';
    }
    return 'bg-slate-600';
  }, [severity]);
  const summaryItems = [
    {
      label: z({ en: 'Income', cy: 'Incwm' }),
      value: (
        <NumberFormat
          prefix="£"
          renderText={(value) => <b>{value}</b>}
          value={Math.abs(income)}
        />
      ),
    },
    {
      label: z({ en: 'Spending', cy: 'Gwariant' }),
      value: (
        <NumberFormat
          prefix="£"
          renderText={(value) => <b>{value}</b>}
          value={Math.abs(spending)}
        />
      ),
    },
  ];

  return (
    <div data-testid="real-time-summary" role="status" aria-live={ariaLive}>
      <SummaryTotal
        defaultValue={divisor}
        items={summaryItems}
        summary={{
          value: (
            <NumberFormat
              prefix="£"
              renderText={(value) => <b>{value}</b>}
              value={Math.abs(total)}
            />
          ),
          label: z(summaryText),
          background,
        }}
        showHeading={true}
        isProgress={true}
      />
    </div>
  );
};

export default RealTimeSummary;
