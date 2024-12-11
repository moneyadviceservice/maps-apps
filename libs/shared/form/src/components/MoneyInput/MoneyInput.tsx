import { twMerge } from 'tailwind-merge';

import type { Props as NumberInputProps } from '../NumberInput';
import { NumberInput } from '../NumberInput';
export type MoneyInputProps = NumberInputProps;

type Props = MoneyInputProps & {
  inputClassName?: string;
  addon?: string;
  inputBackground?: string;
  handleErrorClick?: boolean;
};

export const MoneyInput = ({
  thousandSeparator = true,
  inputClassName,
  addon,
  inputBackground,
  handleErrorClick,
  ...props
}: Props) => {
  return (
    <div className={twMerge('flex', inputClassName)}>
      <span
        aria-hidden
        className="bg-gray-100 py-2 px-3 rounded-l border-gray-400 border border-solid leading-[31px] text-[18px]"
      >
        £
      </span>
      <NumberInput
        thousandSeparator={thousandSeparator}
        className={twMerge(
          'border-gray-400 border-t border-b border-r border-l-0',
          addon ? 'rounded-none border-r-0' : 'rounded-r rounded-l-none',
          inputBackground,
        )}
        {...props}
      />
      {addon && (
        <span
          aria-hidden
          className="px-3 py-2 bg-gray-100 border border-gray-400 border-solid rounded-r text-nowrap"
        >
          {addon}
        </span>
      )}
    </div>
  );
};
