import React from 'react';

import { twMerge } from 'tailwind-merge';

import { getDefaultValues } from '@maps-react/utils/getDefaultValues';

import { Question } from '../../types';
import { NumberInput } from '../NumberInput';

interface DateFieldProps {
  threePartDate: boolean;
  questions: Question[];
  currentStep: number;
  defaultValues?: string;
  fieldErrors?: { day?: boolean; month?: boolean; year?: boolean };
}

export const DateField: React.FC<DateFieldProps> = ({
  threePartDate,
  questions,
  currentStep,
  defaultValues,
  fieldErrors,
}) => {
  const labels = questions[currentStep - 1]?.inputProps?.additionalLabels;
  const enteredValues = getDefaultValues(defaultValues ?? '');

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
              'rounded-[4px] border p-2 text-center',
              fieldErrors?.day ? 'border-red-600' : 'border-gray-400',
            )}
            defaultValue={enteredValues.day}
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
            'rounded-[4px] border p-2 text-center',
            fieldErrors?.month ? 'border-red-600' : 'border-gray-400',
          )}
          defaultValue={enteredValues.month}
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
            'rounded-[4px] border p-2 text-center',
            fieldErrors?.year ? 'border-red-600' : 'border-gray-400',
          )}
          defaultValue={enteredValues.year}
        />
      </div>
    </div>
  );
};

export default DateField;
