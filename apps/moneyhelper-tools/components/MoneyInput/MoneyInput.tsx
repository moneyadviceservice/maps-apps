import type { Props as NumberInputProps } from 'components/NumberInput';
import { NumberInput } from 'components/NumberInput';
import classNames from 'classnames';
export type MoneyInputProps = NumberInputProps;

type Props = MoneyInputProps & {
  inputClassName?: string;
};

export const MoneyInput = ({
  thousandSeparator = true,
  inputClassName,
  ...props
}: Props) => {
  return (
    <div className={classNames('flex', inputClassName)}>
      <span
        aria-hidden
        className="bg-gray-100 py-2 px-3 rounded-l border-gray-400 border border-solid"
      >
        £
      </span>
      <NumberInput
        thousandSeparator={thousandSeparator}
        className="border-gray-400 border-t border-b border-r border-l-0 rounded-r rounded-l-none"
        {...props}
      />
    </div>
  );
};
