import { ChangeEvent, useEffect, useState } from 'react';

import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import NumberFormat from '@maps-react/common/components/NumberFormat';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Options, Select } from '@maps-react/form/components/Select';

export enum SUMMARY_TOTAL_STATUS_TYPES {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  BALANCED = 'balanced',
}

type Props = {
  variant?: 'realTime' | 'summary';
  title: string;
  titleWithFrequency?: string;
  income: number;
  spending: number;
  balance: number;
  incomeLabel: string;
  spendingLabel: string;
  balanceLabel: string;
  dropDownOptions?: Options[];
  onSelectClick?: (event: ChangeEvent<HTMLSelectElement>) => void;
  defaultSummaryTotal?: string;
  action?: string;
  buttonText?: string;
  status?: SUMMARY_TOTAL_STATUS_TYPES;
  className?: string;
  'data-testid'?: string;
};

export const SummaryTotal = ({
  'data-testid': testId,
  variant = 'realTime',
  title,
  titleWithFrequency,
  income,
  incomeLabel,
  spending,
  spendingLabel,
  balance,
  balanceLabel,
  className = '',
  status = SUMMARY_TOTAL_STATUS_TYPES.BALANCED,
  dropDownOptions,
  onSelectClick,
  defaultSummaryTotal,
  buttonText,
  action,
}: Props) => {
  const [hasJS, setHasJS] = useState(false);

  useEffect(() => {
    setHasJS(true);
  }, []);

  const mainClasses = [
    'py-[22px]',
    'pl-4',
    'pr-6',
    'rounded',
    'text-lg',
    'grid',
    'grid-cols-3',
    'gap-2',
  ];

  return (
    <div
      data-testid={testId}
      className={twMerge(
        'px-2 pt-6 pb-4 space-y-4 border rounded border-slate-400 h-fit',
        className,
      )}
    >
      <Heading
        component={variant === 'summary' ? 'h3' : 'h2'}
        level={variant === 'summary' ? 'h3' : 'h6'}
        className={twMerge(
          variant === 'summary'
            ? 'font-semibold text-center'
            : 'text-gray-800 font-bold pl-2 text-xl leading-7',
        )}
      >
        <span>{title}</span>
        {titleWithFrequency && (
          <span className="pl-2 text-xl font-normal">{titleWithFrequency}</span>
        )}
      </Heading>

      {dropDownOptions && (
        <div className="flex flex-col space-y-3.5">
          <Select
            name="summaryOptions"
            data-testid="t-summary-options"
            options={dropDownOptions}
            onChange={onSelectClick}
            defaultValue={defaultSummaryTotal}
          />

          {!hasJS && (
            <Button
              className="self-end"
              variant="primary"
              type="submit"
              formAction={action}
            >
              {buttonText}
            </Button>
          )}
        </div>
      )}

      <div className="space-y-2">
        {/* Income and spending */}
        {[
          { label: incomeLabel, value: income },
          { label: spendingLabel, value: spending },
        ].map((item) => (
          <div key={item.label} className={twMerge(mainClasses, 'bg-gray-100')}>
            <Paragraph className="col-span-2 m-0 w-[90%]">
              {item.label}
            </Paragraph>
            <NumberFormat
              className="font-bold justify-self-end"
              prefix="£"
              value={item.value}
              decimalScale={2}
              fixedDecimalScale={true}
            />
          </div>
        ))}

        {/* Total balance */}
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
          <NumberFormat
            className="font-bold justify-self-end"
            prefix="£"
            value={balance}
            decimalScale={2}
            fixedDecimalScale={true}
          />
        </div>
      </div>
    </div>
  );
};
