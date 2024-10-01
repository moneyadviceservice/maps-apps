import { NumberFormatValues } from 'react-number-format';
import type { Props as NumberInputProps } from '../NumberInput';
import { NumberInput } from '../NumberInput';
import { twMerge } from 'tailwind-merge';

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
    <div className={twMerge('flex', inputClassName)}>
      <NumberInput
        isAllowed={minMaxNumberCheck}
        className={twMerge(
          'border-gray-400 border-t border-b border-r-0 border-l-1 rounded-l',
          inputBackground,
        )}
        {...rest}
      />
      <span
        aria-hidden
        className="bg-gray-100 px-3 h-[49px] rounded-r border-gray-400 border border-solid justify-center flex items-center"
      >
        %
      </span>
    </div>
  );
};
