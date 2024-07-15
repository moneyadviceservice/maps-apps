import { NumberFormatValues } from 'react-number-format';
import type { Props as NumberInputProps } from 'components/NumberInput';
import { NumberInput } from 'components/NumberInput';

export type PercentInputProps = NumberInputProps;

export const PercentInput = ({ ...props }: PercentInputProps) => {
  const MAX_PERCENT_VALUE = 100;

  const minMaxNumberCheck = ({ floatValue }: NumberFormatValues) => {
    if (!floatValue) {
      return true;
    }
    return floatValue <= MAX_PERCENT_VALUE && floatValue >= 0;
  };

  return (
    <div className="flex">
      <NumberInput
        isAllowed={minMaxNumberCheck}
        className="border-gray-400 border-t border-b border-r-0 border-l-1 rounded-l"
        {...props}
      />
      <span
        aria-hidden
        className="bg-gray-100 py-2 px-3 rounded-r border-gray-400 border border-solid"
      >
        %
      </span>
    </div>
  );
};
