import {
  DetailedHTMLProps,
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
} from 'react';

import { twMerge } from 'tailwind-merge';

import { Paragraph } from '@maps-react/common/components/Paragraph';

const labelStyles = {
  default:
    'align-self-center max-w-[calc(100%-40px)] pl-[12px] cursor-pointer touch-action-manipulation',
  before:
    "before:content-[''] before:box-border before:absolute before:top-0 before:left-0 before:w-[40px] before:h-[40px] before:bg-transparent before:rounded-full before:border before:border-gray-400",
  after:
    "after:content-[''] after:absolute after:top-[8px] after:left-[8px] after:w-0 after:h-0 after:border-[12px] after:border-solid after:border-magenta-500 after:rounded-full after:opacity-0",
  hover:
    'peer-checked:hover:after:border-pink-800 peer-focus:hover:after:border-magenta-500',
  active:
    'active:after:opacity-100 active:after:border-white peer-checked:active:after:border-pink-400 peer-disabled:active:after:border-gray-200 peer-focus:active:after:border-magenta-500',
  inputFocus:
    'peer-focus:before:border-4 peer-focus:before:border-blue-700 peer-focus:before:outline-[3px] peer-focus:before:outline-black peer-focus:before:outline-offset-1 peer-focus:before:shadow-[0_0_0_3px] peer-focus:before:shadow-yellow-400',
  inputChecked: 'peer-checked:after:opacity-100',
};

export const concatenatedLabelStyles = Object.values(labelStyles).join(' ');
const errorStyles = 'before:border-2 before:border-red-700';
const disabledAfterStyles =
  'opacity-60 cursor-not-allowed after:top-[1px] after:left-[1px] after:border-[19px] after:border-gray-200 after:opacity-100 hover:after:border-gray-200';

export type RadioButtonProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  testId?: string;
  hasError?: boolean;
  radioInputTestId?: string;
  classNameLabel?: string;
  hint?: string;
};

export const RadioButton = forwardRef(
  (
    {
      children,
      className,
      classNameLabel,
      testId = 'radio-button',
      radioInputTestId = 'radio-button-input',
      hasError = false,
      hint,
      ...props
    }: RadioButtonProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const hintId = `${testId}-hint`;

    return (
      <div className="relative text-base" data-testid={testId}>
        <div className="flex flex-wrap items-center">
          <input
            ref={ref}
            className={twMerge(
              'w-[40px] h-[40px] m-0 opacity-0 cursor-pointer peer',
              className,
              hasError && errorStyles,
            )}
            data-testid={radioInputTestId}
            type="radio"
            aria-describedby={hint ? hintId : undefined}
            {...props}
          />
          <label
            className={twMerge(
              concatenatedLabelStyles,
              classNameLabel,
              hasError && errorStyles,
              props.disabled && disabledAfterStyles,
            )}
            htmlFor={props.id}
            data-testid={`${testId}-label`}
          >
            {children}
          </label>
        </div>
        {hint && (
          <Paragraph
            id={hintId}
            className="pl-3 mb-0 ml-10 text-gray-650"
            data-testid={hintId}
          >
            {hint}
          </Paragraph>
        )}
      </div>
    );
  },
);
