import { ChangeEvent, ForwardedRef, forwardRef } from 'react';

import { twMerge } from 'tailwind-merge';

import { Errors } from '@maps-react/common/components/Errors';
import { Paragraph } from '@maps-react/common/components/Paragraph';

import { ErrorType } from '../../types';
import { RadioButton } from '../RadioButton';

export type QuestionRadioButtonProps = {
  children?: string;
  options: QuestionOption[];
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  defaultChecked?: string;
  testId?: string;
  className?: string;
  horizontalLayout?: boolean;
  /**
   * Proposal is to superceded the hasError prop with the 'error' prop.
   * Only once this is fully migrated across all usages.
   * 3 tasks to complete this:
   * 1) Pass hasError={!!error} into the 'RadioButton' component.
   * 2) Pass error={!!error} into the 'Errors' component.
   * 3) Update the 'Errors' component to accept a boolean value, as this is the only requirement for it to function as intended.
   */
  hasError?: boolean;
  hint?: string;
  error?: string;
  hasErrorWrapper?: boolean; // Optional prop to wrap with Errors component - some usages may not want this
  hideLabel?: boolean;
};

export interface QuestionOption {
  text: string;
  value: string;
  disabled?: boolean;
  hint?: string;
}

export const QuestionRadioButton = forwardRef(
  (
    {
      options,
      children,
      onChange,
      name,
      defaultChecked,
      testId = 'question-radio',
      className,
      horizontalLayout = false,
      hasError = false,
      hint,
      error,
      hasErrorWrapper = false,
      hideLabel = false,
    }: QuestionRadioButtonProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const errorId = `${testId}-error`;
    const hintId = `${testId}-hint`;
    // Only apply margin if label is visible, or if hint or error is present
    const hasTopMargin = (!!children && !hideLabel) || !!hint || !!error;

    const content = (
      <div
        data-testid={testId}
        className={twMerge('text-base', className)}
        aria-describedby={
          hint && error
            ? `${hintId} ${errorId}`
            : hint
            ? hintId
            : error
            ? errorId
            : undefined
        }
      >
        {children && (
          <legend
            className={twMerge(
              'text-2xl text-gray-800',
              hideLabel && 'sr-only',
            )}
            data-testid={`${testId}-legend`}
          >
            {children}
          </legend>
        )}
        {hint && (
          <Paragraph
            id={hintId}
            className="mb-0 text-gray-600"
            data-testid={hintId}
          >
            {hint}
          </Paragraph>
        )}
        {error && (
          <Paragraph
            id={errorId}
            className="mb-0 text-red-700"
            data-testid={errorId}
          >
            {error}
          </Paragraph>
        )}
        <div
          className={twMerge(
            'flex flex-col gap-6',
            hasTopMargin && 'mt-4',
            horizontalLayout && 'flex-row',
          )}
        >
          {options.map(({ text, value, disabled, hint }, index) => {
            return (
              <div
                key={name + value}
                className={twMerge(disabled && ['opacity-25'])}
              >
                <RadioButton
                  ref={ref}
                  defaultChecked={defaultChecked === value && !disabled}
                  required
                  disabled={disabled}
                  onChange={onChange}
                  name={name}
                  value={value}
                  id={name + '-' + index}
                  hasError={hasError}
                  hint={hint}
                >
                  {text}
                </RadioButton>
              </div>
            );
          })}
        </div>
      </div>
    );

    // Wrap with Errors component if hasErrorWrapper is true and there is an error message
    return hasErrorWrapper && error ? (
      <Errors errors={[{} as ErrorType]}>{content}</Errors>
    ) : (
      content
    );
  },
);
