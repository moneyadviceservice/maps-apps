import {
  NumberFormatValues,
  NumericFormat,
  NumericFormatProps,
} from 'react-number-format';
import { twMerge } from 'tailwind-merge';
import { useId } from 'react';

export interface Props extends NumericFormatProps {
  isFullWidth?: boolean;
  dataTestId?: string;
}

export const NumberInput = ({
  id,
  name,
  defaultValue,
  onChange,
  className,
  isFullWidth = true,
  dataTestId = 'number-input',
  ...rest
}: Props) => {
  const generatedId = useId();
  id = id ?? generatedId;

  const MAX_INPUT_VALUE = 999999999999;

  const minMaxNumberCheck = ({ floatValue }: NumberFormatValues) => {
    if (!floatValue) {
      return true;
    }
    return floatValue <= MAX_INPUT_VALUE && floatValue >= 0;
  };

  return (
    <NumericFormat
      id={id}
      data-testid={dataTestId}
      name={name}
      className={twMerge(
        'tool-field',
        isFullWidth && 'w-full',
        'border',
        'pl-2',
        'ml-0',
        'h-auto',
        'focus:outline-purple-700',
        'focus:shadow-focus-outline',
        className,
      )}
      defaultValue={defaultValue}
      decimalSeparator="."
      decimalScale={3}
      isAllowed={minMaxNumberCheck}
      onChange={onChange}
      {...rest}
    />
  );
};
