import { twMerge } from 'tailwind-merge';

import { H6 } from '@maps-react/common/components/Heading';
import NumberFormat from '@maps-react/common/components/NumberFormat';
import { Paragraph } from '@maps-react/common/components/Paragraph';

export enum SUMMARY_TOTAL_STATUS_TYPES {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  BALANCED = 'balanced',
}

type Props = {
  title: string;
  income: number;
  spending: number;
  balance: number;
  incomeLabel: string;
  spendingLabel: string;
  balanceLabel: string;
  status?: SUMMARY_TOTAL_STATUS_TYPES;
  className?: string;
  'data-testid'?: string;
};

export const SummaryTotal = ({
  'data-testid': testId,
  title,
  income,
  incomeLabel,
  spending,
  spendingLabel,
  balance,
  balanceLabel,
  className = '',
  status = SUMMARY_TOTAL_STATUS_TYPES.BALANCED,
}: Props) => {
  const mainClasses = [
    'py-[22px]',
    'pl-4',
    'pr-6',
    'rounded',
    'text-lg',
    'grid',
    'grid-cols-3',
  ];
  return (
    <div
      data-testid={testId}
      className={twMerge(
        className,
        'px-2 pt-6 pb-4 space-y-2 border rounded border-slate-400 h-fit',
      )}
    >
      <H6 className="pb-2 pl-2 text-xl">{title}</H6>
      {[
        { label: incomeLabel, value: income },
        { label: spendingLabel, value: spending },
      ].map((item, idx) => (
        <div key={idx} className={twMerge(mainClasses, 'bg-gray-100')}>
          <Paragraph className="col-span-2 m-0">{item.label}</Paragraph>
          <NumberFormat
            className="justify-self-end"
            prefix="£"
            value={item.value}
          />
        </div>
      ))}

      <div
        className={twMerge(
          mainClasses,
          'text-white',
          status === SUMMARY_TOTAL_STATUS_TYPES.BALANCED && 'bg-gray-650',
          status === SUMMARY_TOTAL_STATUS_TYPES.POSITIVE && 'bg-green-700',
          status === SUMMARY_TOTAL_STATUS_TYPES.NEGATIVE && 'bg-red-700',
        )}
      >
        <Paragraph className="col-span-2 m-0">{balanceLabel}</Paragraph>
        <NumberFormat className="justify-self-end" prefix="£" value={balance} />
      </div>
    </div>
  );
};
