import { DetailedHTMLProps, InputHTMLAttributes, useMemo } from 'react';

import { formatCurrency } from '../../utils/formatCurrency';

export type RangeSliderProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label?: string;
  divClasses?: string;
  unit?: 'pounds' | 'percentage' | 'years';
};

export const RangeSlider = ({
  label,
  min = 0,
  max = 100,
  value,
  step = 1,
  divClasses,
  onChange,
  unit = 'pounds',
  ...props
}: RangeSliderProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event);
    }
  };

  const positionPercentage = useMemo(
    () => ((Number(value) - Number(min)) * 100) / (Number(max) - Number(min)),
    [value, min, max],
  );

  // (Number(value) / 100) * Number(max) - Number(min)

  const unitWithVal = (val: number) => {
    switch (unit) {
      case 'pounds': {
        return `${formatCurrency(val, 0)}`;
      }
      case 'percentage': {
        return `${val}%`;
      }
      case 'years': {
        return `${val} year${val > 1 ? 's' : ''}`;
      }
    }
  };

  return (
    <div className={divClasses}>
      {label && <label>{label}</label>}
      <input
        type="range"
        step={step}
        style={{
          background: `linear-gradient(to right, #c82a87 ${positionPercentage}%, #FFFFFF ${positionPercentage}%)`,
        }}
        className="w-full mt-4 mb-3 tool-slider"
        min={min}
        max={max}
        value={Number(value) || 0}
        onChange={onChange ?? handleChange}
        {...props}
      />
      <div aria-hidden className="flex justify-between">
        <p>{unitWithVal(Number(min))}</p>
        <p>{unitWithVal(Number(max))}</p>
      </div>
    </div>
  );
};
