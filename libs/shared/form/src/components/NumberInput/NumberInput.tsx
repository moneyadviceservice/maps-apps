import { useId } from 'react';
import {
  NumberFormatValues,
  NumericFormat,
  NumericFormatProps,
} from 'react-number-format';

import { twMerge } from 'tailwind-merge';

export interface Props extends NumericFormatProps {
  isFullWidth?: boolean;
  dataTestId?: string;
  hasGlassBoxClass?: boolean;
  maxValue?: number;
}

export const NumberInput = ({
  id,
  name,
  defaultValue,
  onChange,
  className,
  isFullWidth = true,
  maxValue = 999999999999,
  dataTestId = 'number-input',
  hasGlassBoxClass = false,
  ...rest
}: Props) => {
  const generatedId = useId();
  id = id ?? generatedId;

  const minMaxNumberCheck = ({ floatValue }: NumberFormatValues) => {
    if (!floatValue) {
      return true;
    }
    return floatValue <= maxValue && floatValue >= 0;
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
        'focus:outline-none',
        'focus:shadow-focus-outline',
        hasGlassBoxClass ? 'obfuscate' : '',
        className,
      )}
      defaultValue={defaultValue}
      decimalSeparator="."
      decimalScale={3}
      isAllowed={minMaxNumberCheck}
      onChange={onChange}
      inputMode="numeric"
      {...rest}
    />
  );
};
