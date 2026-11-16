import { twMerge } from 'tailwind-merge';

import { AffixInput } from '@maps-react/form/components/AffixInput';
import { Options, Select } from '@maps-react/form/components/Select';

export const INCOME_FIELD_GROUP_CLASS = 'w-full max-w-[412px]';

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
        <p id={errorId} className="mb-2 text-red-500">
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
          <AffixInput
            variant="money"
            id={amountId}
            name={amountName}
            value={amountValue}
            onChange={(event) => onAmountChange?.(event.target.value)}
            hasError={hasError}
            aria-describedby={describedBy}
            containerClassName="w-full h-[40px]"
            inputClassName="w-full h-[40px]"
            className="h-[40px] w-full"
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
