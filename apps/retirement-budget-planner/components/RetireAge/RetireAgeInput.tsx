import { ChangeEvent } from 'react';
import { NumberFormatValues } from 'react-number-format';

import { Partner } from 'lib/types/aboutYou';
import { getErrorMessageByKey, hasFieldError } from 'lib/validation/partner';
import { twMerge } from 'tailwind-merge';

import { Errors } from '@maps-react/common/components/Errors';
import {
  NumberInput,
  Props as NumberInputProps,
} from '@maps-react/form/components/NumberInput';

type RetireAgeInputProps = NumberInputProps & {
  inputClassName?: string;
  inputBackground?: string;
  suffixField: number;
  retireAge: string;
  formErrors: Record<keyof Partner, string> | null | undefined;

  onAgeChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const RetireAgeInput = ({
  inputClassName,
  inputBackground,
  suffixField,
  retireAge,
  onAgeChange,
  formErrors,
  ...rest
}: RetireAgeInputProps) => {
  const minMaxNumberCheck = ({ floatValue, value }: NumberFormatValues) => {
    if (!floatValue) {
      return true;
    }
    return (
      floatValue === undefined ||
      (value.length <= 2 && floatValue >= 0 && floatValue <= 99)
    );
  };

  return (
    <>
      {' '}
      <label
        htmlFor={`retire_age_${suffixField}`}
        className="pt-4 mt-4 mb-4 text-lg text-gray-800"
      >
        I would like to retire at the age of :
      </label>
      <Errors errors={hasFieldError('retireAge', formErrors)}>
        {hasFieldError('dob', formErrors) && (
          <p id="retireAge-error" className="mb-1 text-red-700">
            {getErrorMessageByKey('retireAge', formErrors)}
          </p>
        )}
        <div
          className={twMerge(
            'relative flex w-[220px] sm:w-[300px] md:w-[360px] lg:w-[420px] mt-2',
            inputClassName,
          )}
        >
          <NumberInput
            id={`retire_age_${suffixField}`}
            name={`retireAge`}
            isAllowed={minMaxNumberCheck}
            className={twMerge(
              'border-gray-400 py-[11px] pb-[12px] pr-12 border rounded focus:border-blue-700',
              inputBackground,
              getErrorMessageByKey('retireAge', formErrors)
                ? 'border-red-700'
                : '',
            )}
            min={55}
            max={99}
            {...rest}
            value={retireAge}
            onChange={onAgeChange}
          />
          <span
            aria-hidden
            className="absolute top-[1px] right-[1px] bg-gray-100 px-3 h-[calc(100%-2px)] rounded-r border-gray-400 border-l border-solid justify-center flex items-center"
          >
            years
          </span>
        </div>
      </Errors>
    </>
  );
};
