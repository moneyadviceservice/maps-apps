import {
  NumberFormatValues,
  NumericFormat,
  NumericFormatProps,
} from 'react-number-format';
import classNames from 'classnames';
import { useId } from 'react';

export type Props = NumericFormatProps;

export const NumberInput = ({
  id,
  name,
  defaultValue,
  onChange,
  className,
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
      data-testid={'number-input'}
      name={name}
      className={classNames(
        className,
        'tool-field',
        'w-full',
        'border',
        'pl-2',
        'ml-0',
        'h-auto',
        'focus:outline-purple-700',
        'focus:shadow-focus-outline',
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
