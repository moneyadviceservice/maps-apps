import { ChangeEvent, forwardRef } from 'react';

import { twMerge } from 'tailwind-merge';

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
  hasError?: boolean;
};

export interface QuestionOption {
  text: string;
  value: string;
  disabled?: boolean;
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
    }: QuestionRadioButtonProps,
    ref,
  ) => {
    return (
      <div data-testid={testId} className={className}>
        {children ? (
          <legend className="mb-2 text-lg font-bold text-gray-800">
            {children}
          </legend>
        ) : null}
        <div
          className={twMerge(
            'flex flex-col gap-4 mt-3',
            horizontalLayout && 'flex-row',
          )}
        >
          {options.map(({ text, value, disabled }, index) => {
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
                >
                  {text}
                </RadioButton>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
