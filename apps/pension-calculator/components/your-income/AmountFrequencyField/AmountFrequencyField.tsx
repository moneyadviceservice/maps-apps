import { twMerge } from 'tailwind-merge';

import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { Options, Select } from '@maps-react/form/components/Select';

export const INCOME_FIELD_GROUP_CLASS = 'w-full max-w-[412px]';

// TODO: raise a ticket to add prefixClassName on shared MoneyInput.
// The £ span is hardcoded with leading-[31px], which does not centre at 40px.
const MONEY_PREFIX_ALIGN_CLASS =
  '[&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:!leading-none';

type Props = {
  amountId: string;
  amountName: string;
  amountValue: string;
  amountLabel: string;
  frequencyId: string;
  frequencyName: string;
  frequencyValue: string;
  frequencyLabel: string;
  frequencyOptions: Options[];
  legend: string;
  legendClassName?: string;
  hint?: string;
  error?: string;
  hasError?: boolean;
  onAmountChange?: (value: string) => void;
  onFrequencyChange?: (value: string) => void;
};

export const AmountFrequencyField = ({
  amountId,
  amountName,
  amountValue,
  amountLabel,
  frequencyId,
  frequencyName,
  frequencyValue,
  frequencyLabel,
  frequencyOptions,
  legend,
  legendClassName = 'text-2xl font-medium text-gray-800',
  hint,
  error,
  hasError = false,
  onAmountChange,
  onFrequencyChange,
}: Props) => {
  const hintId = hint ? `${amountId}-hint` : undefined;
  const errorId = error ? `${amountId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset aria-describedby={describedBy} className="min-w-0">
      <legend className={legendClassName}>{legend}</legend>
      {hint && (
        <p
          id={hintId}
          className="my-4 text-base font-medium leading-[1.6] tracking-[0.18px] text-gray-800"
        >
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mb-2 text-red-700">
          {error}
        </p>
      )}
      <div
        className={twMerge(
          INCOME_FIELD_GROUP_CLASS,
          'grid grid-cols-1 gap-2 md:grid-cols-2',
        )}
      >
        <div className="min-w-0">
          <label htmlFor={amountId} className="sr-only">
            {amountLabel}
          </label>
          <MoneyInput
            id={amountId}
            name={amountName}
            value={amountValue}
            onChange={(event) => onAmountChange?.(event.target.value)}
            aria-invalid={hasError || undefined}
            containerClassName="w-full h-[40px]"
            inputClassName={twMerge(
              'w-full h-[40px]',
              MONEY_PREFIX_ALIGN_CLASS,
            )}
            className={twMerge(
              'peer h-[40px] w-full py-[8px] pl-[43px] rounded focus:border-blue-700',
              hasError ? 'border-red-700 border-2' : 'border-gray-400 border',
            )}
          />
        </div>
        <div className="min-w-0">
          <Select
            id={frequencyId}
            name={frequencyName}
            options={frequencyOptions}
            value={frequencyValue}
            hideEmptyItem
            hideLabel
            label={frequencyLabel}
            hasError={hasError}
            className="mt-0 w-full"
            onChange={(event) => onFrequencyChange?.(event.target.value)}
          />
        </div>
      </div>
    </fieldset>
  );
};
