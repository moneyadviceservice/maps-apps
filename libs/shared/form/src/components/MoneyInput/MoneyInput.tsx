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
    <div className={twMerge('relative flex', inputClassName)}>
      <span
        aria-hidden
        className="absolute bg-gray-100 top-[1px] left-[1px] py-2 px-3 rounded-l border-gray-400 border-r border-solid leading-[31px] text-[18px]"
      >
        £
      </span>
      <NumberInput
        thousandSeparator={thousandSeparator}
        className={twMerge(
          'border-gray-400 border py-[11px] pb-[12px] pl-12 rounded focus:border-blue-800',
          addon ? 'pr-12' : '',
          inputBackground,
        )}
        {...props}
      />
      {addon && (
        <span
          aria-hidden
          className="absolute top-[1px] right-[1px] px-3 py-2 bg-gray-100 border-l border-gray-400 border-solid rounded-r text-nowrap h-[calc(100%-2px)] text-[18px]"
        >
          {addon}
        </span>
      )}
    </div>
  );
};
