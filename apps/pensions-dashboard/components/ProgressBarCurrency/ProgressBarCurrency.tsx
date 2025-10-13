import { twMerge } from 'tailwind-merge';

import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';

type Props = {
  amount: number;
  total: number;
  suffix?: string;
};

export const ProgressBarCurrency = ({ amount, total, suffix }: Props) => {
  const value = Math.max(0, Math.min(amount, total));
  const progress = `${(value / total) * 100}%`;
  const classes = 'absolute inset-0 flex items-center px-2';

  const text = suffix
    ? `${formatCurrency(value)} ${suffix}`
    : formatCurrency(value);

  return (
    <div className="relative w-full h-10 overflow-hidden bg-blue-700/20 ">
      <div className="h-full bg-blue-700" style={{ width: progress }}></div>
      <div className={twMerge(classes, 'text-base font-bold')}>
        <span
          className={twMerge(classes, 'text-white')}
          style={{ clipPath: `inset(0 calc(100% - ${progress}) 0 0)` }}
        >
          {text}
        </span>
        <span
          className={twMerge(classes, 'text-blue-700')}
          style={{ clipPath: `inset(0 0 0 ${progress})` }}
          aria-hidden="true"
        >
          {text}
        </span>
      </div>
    </div>
  );
};
