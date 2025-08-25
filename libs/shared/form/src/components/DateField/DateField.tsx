import React from 'react';

import { twMerge } from 'tailwind-merge';

import { getDefaultValues } from '@maps-react/utils/getDefaultValues';

import { Question } from '../../types';
import { NumberInput } from '../NumberInput';

export interface DateFieldProps {
  threePartDate: boolean;
  questions: Question[];
  currentStep: number;
  defaultValues?: string;
  fieldErrors?: { day?: boolean; month?: boolean; year?: boolean };
  hasGlassBoxClass?: boolean;
}

export const DateField: React.FC<DateFieldProps> = ({
  threePartDate,
  questions,
  currentStep,
  defaultValues,
  fieldErrors,
  hasGlassBoxClass,
}) => {
  const labels = questions[currentStep - 1]?.inputProps?.additionalLabels
  const enteredValues = getDefaultValues(defaultValues ?? '');

  const inputStyle = 'rounded-[4px] border p-[8px] text-center'
  const focusStyle = 'focus:border-blue-800'
  const errorStyle = 'border-red-600 border-2 focus:border-blue-800 p-[calc(8px-1px)]'

  return (
    <div className="flex w-full mt-4 space-x-4">
      {threePartDate && (
        <div className="flex flex-col items-start w-[56px]">
          <label htmlFor="day" className="mb-2">
            {labels?.label1}
          </label>
          <NumberInput
            id="day"
            name="day"
            aria-label={labels?.label1 ?? 'Day'}
            className={twMerge(
              inputStyle,
              focusStyle,
              fieldErrors?.day ? errorStyle : 'border-gray-400',
            )}
            defaultValue={enteredValues.day}
            hasGlassBoxClass={hasGlassBoxClass}
          />
        </div>
      )}
      <div className="flex flex-col items-start w-[56px]">
        <label htmlFor="month" className="mb-2">
          {labels?.label2}
        </label>
        <NumberInput
          id="month"
          name="month"
          aria-label={labels?.label2 ?? 'Month'}
          className={twMerge(
            inputStyle,
            focusStyle,
            fieldErrors?.month ? errorStyle : 'border-gray-400',
          )}
          defaultValue={enteredValues.month}
          hasGlassBoxClass={hasGlassBoxClass}
        />
      </div>
      <div className="flex flex-col items-start w-[72px]">
        <label htmlFor="year" className="mb-2">
          {labels?.label3}
        </label>
        <NumberInput
          id="year"
          name="year"
          aria-label={labels?.label3 ?? 'Year'}
          className={twMerge(
            inputStyle,
            focusStyle,
            fieldErrors?.year ? errorStyle : 'border-gray-400',
          )}
          defaultValue={enteredValues.year}
          hasGlassBoxClass={hasGlassBoxClass}
        />
      </div>
    </div>
  );
};

export default DateField;
