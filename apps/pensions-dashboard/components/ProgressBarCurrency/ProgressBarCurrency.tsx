import { Paragraph } from '@maps-digital/shared/ui';

import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';

type Props = {
  amount: number;
  total: number;
  suffix?: string;
  testId?: string;
};

export const ProgressBarCurrency = ({
  amount,
  total,
  suffix,
  testId = 'progress-bar-currency',
}: Props) => {
  const value = Math.max(0, Math.min(amount, total));
  const progress = `${(value / total) * 100}%`;

  const text = suffix
    ? `${formatCurrency(value)} ${suffix}`
    : formatCurrency(value);

  return (
    <>
      <Paragraph
        data-testid={testId}
        className="text-base font-bold text-blue-700 md:mb-2"
      >
        {text}
      </Paragraph>
      <div
        aria-hidden="true"
        className="overflow-hidden h-9 md:h-12 bg-blue-700/20"
      >
        <div className="h-full bg-blue-700" style={{ width: progress }} />
      </div>
    </>
  );
};
