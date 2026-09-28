import { NumberFormatValues } from 'react-number-format';

import { twMerge } from 'tailwind-merge';

import type { Props as NumberInputProps } from '../NumberInput';
import { NumberInput } from '../NumberInput';

export type PercentInputProps = NumberInputProps & {
  inputClassName?: string;
  containerClassName?: string;
  inputBackground?: string;
};

export const PercentInput = ({
  inputClassName,
  containerClassName,
  inputBackground,
  ...rest
}: PercentInputProps) => {
  const MAX_PERCENT_VALUE = 100;

  const minMaxNumberCheck = ({ floatValue }: NumberFormatValues) => {
    if (!floatValue) {
      return true;
    }
    return floatValue <= MAX_PERCENT_VALUE && floatValue >= 0;
  };

  return (
    <div className={twMerge('flex', containerClassName)}>
      <div className={twMerge('relative', inputClassName)}>
        <NumberInput
          isAllowed={minMaxNumberCheck}
          className={twMerge(
            'peer border-gray-400 py-[8px] pr-12 border rounded focus:border-blue-700',
            inputBackground,
          )}
          inputMode="decimal"
          {...rest}
        />
        <span
          aria-hidden
          className="absolute top-0 right-0 bg-gray-100 px-3 h-full rounded-r border-gray-400 border border-solid justify-center flex items-center peer-focus:border-blue-700 peer-focus:border-l-gray-400"
        >
          %
        </span>
      </div>
    </div>
  );
};
