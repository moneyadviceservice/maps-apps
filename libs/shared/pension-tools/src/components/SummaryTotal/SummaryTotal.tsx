import { ChangeEvent, useEffect, useState } from 'react';

import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import NumberFormat from '@maps-react/common/components/NumberFormat';
import { Options, Select } from '@maps-react/form/components/Select';

import { formatCurrency } from '../../utils/formatCurrency/formatCurrency';

export enum SUMMARY_TOTAL_STATUS_TYPES {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  BALANCED = 'balanced',
}

type AriaLabels = {
  description?: string;
  statusOverspending?: string;
  statusPositive?: string;
  statusBalanced?: string;
  amountSuffix?: string;
  selectLabel?: string;
};

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
  ariaLabels?: AriaLabels;
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
  ariaLabels,
}: Props) => {
  const [hasJS, setHasJS] = useState(false);

  // Use props or default values (parent components handle translations)
  const ariaDescription =
    ariaLabels?.description ||
    'Financial summary showing income, spending and balance';
  const ariaOverspending = ariaLabels?.statusOverspending || 'Overspending';
  const ariaPositive = ariaLabels?.statusPositive || 'Positive balance';
  const ariaBalanced = ariaLabels?.statusBalanced || 'Balanced';
  const ariaAmount = ariaLabels?.amountSuffix || 'amount:';
  const ariaSelect = ariaLabels?.selectLabel || 'Change summary frequency';

  useEffect(() => {
    setHasJS(true);
  }, []);

  const mainClasses = [
    'py-[22px]',
    'pl-4',
    'pr-6',
    'rounded',
    'text-lg',
    'flex',
    'justify-between',
    'gap-4',
  ];

  const statusAriaLabels = {
    [SUMMARY_TOTAL_STATUS_TYPES.NEGATIVE]: ariaOverspending,
    [SUMMARY_TOTAL_STATUS_TYPES.POSITIVE]: ariaPositive,
    [SUMMARY_TOTAL_STATUS_TYPES.BALANCED]: ariaBalanced,
  };

  return (
    <section
      data-testid={testId}
      className={twMerge(
        'px-2 pt-6 pb-4 space-y-4 border rounded border-slate-400 h-fit',
        className,
      )}
      aria-label={title}
    >
      <Heading
        component={variant === 'summary' ? 'h3' : 'h2'}
        level={variant === 'summary' ? 'h3' : 'h6'}
        className={twMerge(
          variant === 'summary'
            ? 'font-semibold text-center'
            : 'text-gray-800 font-bold pl-2 text-xl leading-7',
        )}
        id="summary-total-heading"
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
            aria-label={ariaSelect}
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

      <span id="summary-total-description" className="sr-only">
        {ariaDescription}
      </span>
      <dl
        className="space-y-2"
        aria-labelledby="summary-total-heading"
        aria-describedby="summary-total-description"
      >
        {/* Income and spending */}
        {[
          { label: incomeLabel, value: income },
          { label: spendingLabel, value: spending },
        ].map((item) => (
          <div
            key={item.label}
            className={twMerge(mainClasses, 'bg-gray-100')}
            aria-label={`${item.label} ${formatCurrency(item.value)}`}
          >
            <SummaryRow
              label={item.label}
              amount={item.value}
              ariaAmountSuffix={ariaAmount}
            />
          </div>
        ))}

        {/* Total balance */}
        <div
          className={twMerge(
            mainClasses,
            'text-white',
            status === SUMMARY_TOTAL_STATUS_TYPES.NEGATIVE
              ? 'bg-red-700'
              : 'bg-green-700',
          )}
          aria-label={`${balanceLabel} ${formatCurrency(balance)}. ${
            statusAriaLabels[status]
          }`}
        >
          <SummaryRow
            label={balanceLabel}
            amount={balance}
            ariaAmountSuffix={ariaAmount}
          />
        </div>
      </dl>
    </section>
  );
};

const SummaryRow = ({
  label,
  amount,
  ariaAmountSuffix = 'amount:',
}: {
  label: string;
  amount: number;
  ariaAmountSuffix?: string;
}) => {
  // @note String type check is required to workaround unexpected object values being passed in from tests (e.g. RetirementPlannerLayout.test.tsx)
  const valueTestId =
    typeof label === 'string'
      ? `t-summary-value-${label.toLowerCase().replaceAll(/\s+/g, '-')}`
      : 't-summary-value';

  const formattedAmount = formatCurrency(amount);

  return (
    <>
      <dt className="m-0 break-words grow" aria-label={label}>
        {label}
      </dt>
      <dd
        className="font-bold justify-self-end whitespace-nowrap"
        aria-label={`${label} ${ariaAmountSuffix} ${formattedAmount}`}
      >
        <NumberFormat
          prefix="£"
          value={amount}
          decimalScale={2}
          fixedDecimalScale={true}
          data-testid={valueTestId}
          aria-hidden="true"
        />
      </dd>
    </>
  );
};
