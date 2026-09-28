import React, { ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

import { Errors, ErrorType } from '@maps-react/common/components/Errors';
import { Paragraph } from '@maps-react/common/components/Paragraph';
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
  hintText?: ReactNode;
  errorMessageId?: string;
  hasErrorWrapper?: boolean; // Optional prop to wrap with Errors component - some usages may not want this
  hideLegend?: boolean;
  error?: string;
  className?: string;
  testId?: string;
  children?: ReactNode; // Allow passing children to render inside the fieldset, e.g. ExpandableSection Component (Accordion)
}

export const DateInput: React.FC<DateInputProps> = ({
  showDayField,
  defaultValues,
  fieldErrors,
  hasGlassBoxClass,
  legend,
  hintText,
  errorMessageId,
  hasErrorWrapper = false,
  hideLegend = true,
  error,
  className,
  testId = 'date-field',
  children,
}: DateInputProps) => {
  const { z } = useTranslation();
  const enteredValues = getDefaultValues(defaultValues ?? '');
  const hintId = `${testId}-hint`;
  const hasError = fieldErrors?.day || fieldErrors?.month || fieldErrors?.year;

  const baseStyles = {
    input: 'rounded-[4px] border p-2 text-center h-10',
    focus: 'focus:border-blue-700',
    error: 'border-red-600 border-2 focus:border-blue-700 p-[calc(8px-1px)]',
    wrapper: 'flex flex-col items-start',
    label: 'mb-2',
    hintText: 'mb-0 text-gray-600',
    errorText: 'mb-0 text-red-700',
    legendText: 'text-2xl text-gray-800',
  };

  const renderHintText = () => {
    if (!hintText) return null;

    if (typeof hintText !== 'string') {
      return (
        <Paragraph
          id={hintId}
          className={baseStyles.hintText}
          data-testid={hintId}
        >
          {hintText}
        </Paragraph>
      );
    }

    // Render multi-line hint text with <br /> for line breaks
    return (
      <Paragraph
        id={hintId}
        className={baseStyles.hintText}
        data-testid={hintId}
      >
        {hintText.split('\n').map((line, idx) => (
          <React.Fragment key={`${hintId}-${idx}`}>
            {idx > 0 && <br />}
            {line}
          </React.Fragment>
        ))}
      </Paragraph>
    );
  };

  const content = (
    <div className={twMerge('text-base flex flex-col', className)}>
      <fieldset
        aria-describedby={
          hintText && hasError && errorMessageId
            ? `${hintId} ${errorMessageId}`
            : hintText
            ? hintId
            : hasError && errorMessageId
            ? errorMessageId
            : undefined
        }
      >
        <legend
          className={twMerge(baseStyles.legendText, hideLegend && 'sr-only')}
          data-testid={`${testId}-legend`}
        >
          {legend ?? z({ en: 'Date input', cy: 'Mewnbwn dyddiad' })}
        </legend>
        {renderHintText()}
        {error && (
          <Paragraph
            id={errorMessageId}
            className={baseStyles.errorText}
            data-testid={errorMessageId}
          >
            {error}
          </Paragraph>
        )}
        <div className="flex w-full mt-2">
          {showDayField && (
            <div className={twMerge(baseStyles.wrapper, 'w-[56px] mr-4')}>
              <label htmlFor="day" className={baseStyles.label}>
                {z({ en: 'Day', cy: 'Dydd' })}
              </label>
              <NumberInput
                id="day"
                name="day"
                aria-label={z({ en: 'Day', cy: 'Dydd' })}
                aria-describedby={fieldErrors?.day ? errorMessageId : undefined}
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
              aria-describedby={fieldErrors?.month ? errorMessageId : undefined}
              className={twMerge(
                baseStyles.input,
                baseStyles.focus,
                fieldErrors?.month ? baseStyles.error : 'border-gray-400',
              )}
              defaultValue={enteredValues.month}
              hasGlassBoxClass={hasGlassBoxClass}
            />
          </div>
          <div className={twMerge(baseStyles.wrapper, 'w-[72px]')}>
            <label htmlFor="year" className={baseStyles.label}>
              {z({ en: 'Year', cy: 'Blwyddyn' })}
            </label>
            <NumberInput
              id="year"
              name="year"
              aria-label={z({ en: 'Year', cy: 'Blwyddyn' })}
              aria-describedby={fieldErrors?.year ? errorMessageId : undefined}
              className={twMerge(
                baseStyles.input,
                baseStyles.focus,
                fieldErrors?.year ? baseStyles.error : 'border-gray-400',
              )}
              defaultValue={enteredValues.year}
              hasGlassBoxClass={hasGlassBoxClass}
            />
          </div>
        </div>
        {children}
      </fieldset>
    </div>
  );

  // Wrap with Errors component if hasErrorWrapper is true and there is an error in any of the fields
  return hasErrorWrapper && hasError ? (
    <Errors errors={[{} as ErrorType]}>{content}</Errors>
  ) : (
    content
  );
};
