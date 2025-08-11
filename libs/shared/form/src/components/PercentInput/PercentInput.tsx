import { NumberFormatValues } from 'react-number-format';

import { twMerge } from 'tailwind-merge';

import type { Props as NumberInputProps } from '../NumberInput';
import { NumberInput } from '../NumberInput';

export type PercentInputProps = NumberInputProps & {
  inputClassName?: string;
  inputBackground?: string;
};

export const PercentInput = ({
  inputClassName,
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
    <div className={twMerge('relative flex', inputClassName)}>
      <NumberInput
        isAllowed={minMaxNumberCheck}
        className={twMerge(
          'border-gray-400 py-[11px] pb-[12px] pr-12 border rounded focus:border-blue-800',
          inputBackground,
        )}
        {...rest}
      />
      <span
        aria-hidden
        className="absolute top-[1px] right-[1px] bg-gray-100 px-3 h-[calc(100%-2px)] rounded-r border-gray-400 border-l border-solid justify-center flex items-center"
      >
        %
      </span>
    </div>
  );
};
