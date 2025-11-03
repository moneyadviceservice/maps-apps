import { twMerge } from 'tailwind-merge';

import type { Props as NumberInputProps } from '../NumberInput';
import { NumberInput } from '../NumberInput';
export type MoneyInputProps = NumberInputProps;

type Props = MoneyInputProps & {
  inputClassName?: string;
  containerClassName?: string;
  addon?: string;
  inputBackground?: string;
  handleErrorClick?: boolean;
};

export const MoneyInput = ({
  thousandSeparator = true,
  inputClassName,
  containerClassName,
  addon,
  inputBackground,
  handleErrorClick,
  ...props
}: Props) => {
  return (
    <div className={twMerge('flex', containerClassName)}>
      <div className={twMerge('relative', inputClassName)}>
        <NumberInput
          thousandSeparator={thousandSeparator}
          className={twMerge(
            'peer border-gray-400 border py-[8px] pl-[43px] rounded focus:border-blue-700',
            addon ? 'pr-12' : '',
            inputBackground,
          )}
          inputMode="numeric"
          {...props}
        />
        <span
          aria-hidden
          className="absolute bg-gray-100 top-0 left-0 py-2 px-3 rounded-l border-gray-400 border border-solid leading-[31px] text-[18px] h-full peer-focus:border-blue-700 peer-focus:border-r-gray-400"
        >
          £
        </span>
        {addon && (
          <span
            aria-hidden
            className="absolute top-0 right-0 px-3 py-2 bg-gray-100 border border-gray-400 border-solid rounded-r text-nowrap h-full text-[18px] peer-focus:border-blue-700 peer-focus:border-l-gray-400"
          >
            {addon}
          </span>
        )}
      </div>
    </div>
  );
};
