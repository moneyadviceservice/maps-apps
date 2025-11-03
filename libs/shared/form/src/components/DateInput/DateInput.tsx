import React, { ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { getDefaultValues } from '@maps-react/utils/getDefaultValues';

import { NumberInput } from '../NumberInput';

export interface DateInputProps {
  showDayField: boolean;
  defaultValues?: string;
  fieldErrors?: {
    day?: boolean;
    month?: boolean;
    year?: boolean;
  };
  hasGlassBoxClass?: boolean;
  legend?: string;
  hintText?: string | ReactNode;
}

export const DateInput: React.FC<DateInputProps> = ({
  showDayField,
  defaultValues,
  fieldErrors,
  hasGlassBoxClass,
  legend,
  hintText,
}: DateInputProps) => {
  const { z } = useTranslation();
  const enteredValues = getDefaultValues(defaultValues ?? '');

  const baseStyles = {
    input: 'rounded-[4px] border p-2 text-center',
    focus: 'focus:border-blue-700',
    error: 'border-red-600 border-2 focus:border-blue-700 p-[calc(8px-1px)]',
    wrapper: 'flex flex-col items-start',
    label: 'mb-2',
    hintText: 'text-[#676767] text-md mb-2',
  };

  return (
    <div className="flex flex-col">
      {hintText && (
        <span className={baseStyles.hintText} data-testid="date-field-hint">
          {typeof hintText === 'string' ? hintText : ''}
        </span>
      )}
      <fieldset className="flex w-full mt-4">
        <legend className="sr-only">{legend ?? 'Date input'}</legend>

        {showDayField && (
          <div className={twMerge(baseStyles.wrapper, 'w-[56px] mr-4')}>
            <label htmlFor="day" className={baseStyles.label}>
              {z({ en: 'Day', cy: 'Dydd' })}
            </label>
            <NumberInput
              id="day"
              name="day"
              aria-label={z({ en: 'Day', cy: 'Dydd' })}
              className={twMerge(
                baseStyles.input,
                baseStyles.focus,
                fieldErrors?.day ? baseStyles.error : 'border-gray-400',
              )}
              defaultValue={enteredValues.day}
              hasGlassBoxClass={hasGlassBoxClass}
            />
          </div>
        )}
        <div className={twMerge(baseStyles.wrapper, 'w-[56px] mr-4')}>
          <label htmlFor="month" className={baseStyles.label}>
            {z({ en: 'Month', cy: 'Mis' })}
          </label>
          <NumberInput
            id="month"
            name="month"
            aria-label={z({ en: 'Month', cy: 'Mis' })}
            className={twMerge(
              baseStyles.input,
              baseStyles.focus,
              fieldErrors?.month ? baseStyles.error : 'border-gray-400',
            )}
            defaultValue={enteredValues.month}
            hasGlassBoxClass={hasGlassBoxClass}
          />
        </div>
        <div className={twMerge(baseStyles.wrapper, 'w-[76px]')}>
          <label htmlFor="year" className={baseStyles.label}>
            {z({ en: 'Year', cy: 'Blwyddyn' })}
          </label>
          <NumberInput
            id="year"
            name="year"
            aria-label={z({ en: 'Year', cy: 'Blwyddyn' })}
            className={twMerge(
              baseStyles.input,
              baseStyles.focus,
              fieldErrors?.year ? baseStyles.error : 'border-gray-400',
            )}
            defaultValue={enteredValues.year}
            hasGlassBoxClass={hasGlassBoxClass}
          />
        </div>
      </fieldset>
    </div>
  );
};
