import type { NumberFormatValues } from 'react-number-format';

import {
  RETIRE_AGE_HINT_ID,
  RETIRE_AGE_ID,
  RETIRE_AGE_SUFFIX_ID,
} from 'data/aboutYouFieldIds';

import { Errors } from '@maps-react/common/components/Errors';
import { NumberInput } from '@maps-react/form/components/NumberInput';

type Props = {
  label: string;
  hint: string;
  suffix: string;
  defaultValue?: string;
  error?: string;
};

const twoDigitAge = ({ floatValue, value }: NumberFormatValues) => {
  if (!floatValue) {
    return true;
  }

  return value.length <= 2 && floatValue >= 0 && floatValue <= 99;
};

export const RetirementAgeField = ({
  label,
  hint,
  suffix,
  defaultValue,
  error,
}: Props) => {
  const errorId = `${RETIRE_AGE_ID}-error`;
  const describedBy = [
    RETIRE_AGE_HINT_ID,
    error ? errorId : null,
    RETIRE_AGE_SUFFIX_ID,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Errors errors={error ? [error] : []}>
      <div className="max-w-[400px]">
        <label
          htmlFor={RETIRE_AGE_ID}
          className="block text-2xl font-medium text-gray-800"
        >
          {label}
        </label>
        <p
          id={RETIRE_AGE_HINT_ID}
          className="mt-1 mb-2 text-gray-650 text-pretty"
        >
          {hint}
        </p>
        {error && (
          <p id={errorId} className="mb-2 text-red-700">
            {error}
          </p>
        )}
        <div className="relative flex w-full">
          <NumberInput
            id={RETIRE_AGE_ID}
            name={RETIRE_AGE_ID}
            defaultValue={defaultValue}
            decimalScale={0}
            isAllowed={twoDigitAge}
            aria-describedby={describedBy}
            aria-invalid={!!error || undefined}
            className={`rounded h-[40px] border py-[8px] pr-24 ${
              error ? 'border-2 border-red-700' : 'border-gray-400'
            }`}
          />
          <span
            id={RETIRE_AGE_SUFFIX_ID}
            className="absolute top-[1px] right-[1px] flex h-[calc(100%-2px)] items-center rounded-r border-l border-gray-400 bg-gray-100 px-3"
          >
            {suffix}
          </span>
        </div>
      </div>
    </Errors>
  );
};
