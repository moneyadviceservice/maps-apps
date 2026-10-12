import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { twMerge } from 'tailwind-merge';

export type Props = NumericFormatProps & {
  direction?: 'increase' | 'decrease';
  position?: 'left' | 'right';
};

const NumberFormat = ({
  className,
  direction,
  position = 'left',
  ...props
}: Props) => {
  const arrowCSS = 'inline-block border-solid border-x-transparent';
  const isIncrease = direction === 'increase';
  const isDecrease = direction === 'decrease';

  const iconLeftOrder = 'flex-row-reverse';
  const iconRightOrder = 'flex-row';

  const getNumberWithIcon = (order: string) => {
    return (
      <span className={`flex items-center gap-2 ${order}`}>
        <NumericFormat
          className={className}
          decimalScale={2}
          fixedDecimalScale={true}
          displayType="text"
          thousandSeparator={true}
          {...props}
        />
        <span
          className={twMerge(
            arrowCSS,
            isIncrease &&
              'border-b-[13px] border-x-[8px] border-t-0 border-b-red-700',
            isDecrease &&
              'border-t-[13px] border-x-[8px] border-b-0 border-t-green-700',
          )}
        ></span>
      </span>
    );
  };

  if (direction && position === 'left') {
    return (
      <span className="inline-flex">{getNumberWithIcon(iconLeftOrder)}</span>
    );
  }

  if (direction && position === 'right') {
    return (
      <span className="inline-flex">{getNumberWithIcon(iconRightOrder)}</span>
    );
  }

  return (
    <NumericFormat
      className={className}
      decimalScale={2}
      displayType="text"
      thousandSeparator={true}
      {...props}
    />
  );
};

export default NumberFormat;
