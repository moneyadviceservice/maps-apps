import {
  DetailedHTMLProps,
  ForwardedRef,
  InputHTMLAttributes,
  forwardRef,
} from 'react';
import { twMerge } from 'tailwind-merge';

const labelStyles = {
  default:
    'align-self-center max-w-[calc(100%-40px)] p-[7px] pl-[12px] cursor-pointer touch-action-manipulation',
  before:
    "before:content-[''] before:box-border before:absolute before:top-0 before:left-0 before:w-[40px] before:h-[40px] before:bg-transparent before:rounded-full before:border before:border-gray-400",
  after:
    "after:content-[''] after:absolute after:top-[8px] after:left-[8px] after:w-0 after:h-0 after:border-[12px] after:border-solid after:border-pink-600 after:rounded-full after:opacity-0",
  hover: 'hover:after:opacity-100 hover:after:border-pink-800',
  active: 'active:after:opacity-100 active:after:border-pink-400',
  inputFocus:
    'peer-focus:before:border-4 peer-focus:before:border-purple-700 peer-focus:before:outline-[3px] peer-focus:before:outline-black peer-focus:before:outline-offset-1 peer-focus:before:shadow-[0_0_0_4px] peer-focus:before:shadow-yellow-200',
  inputChecked: 'peer-checked:after:opacity-100',
};

const concatenatedLabelStyles = Object.values(labelStyles).join(' ');

const errorStyles = 'before:border-2 before:border-red-700';

export type RadioButtonProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & { testId?: string; hasError?: boolean };

export const RadioButton = forwardRef(
  (
    {
      children,
      className,
      testId = 'radio-button',
      hasError = false,
      ...props
    }: RadioButtonProps,
    ref,
  ) => {
    return (
      <div className="flex flex-wrap relative" data-testid={testId}>
        <input
          ref={ref as ForwardedRef<HTMLInputElement>}
          className={twMerge(
            'w-[40px] h-[40px] m-0 opacity-0 cursor-pointer peer',
            className,
            hasError && errorStyles,
          )}
          type="radio"
          {...props}
        />

        <label
          className={twMerge(concatenatedLabelStyles, hasError && errorStyles)}
          htmlFor={props.id}
        >
          {children}
        </label>
      </div>
    );
  },
);
