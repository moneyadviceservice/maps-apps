import { ChangeEvent, ReactNode, SelectHTMLAttributes } from 'react';

import { twMerge } from 'tailwind-merge';

import { Errors, ErrorType } from '@maps-react/common/components/Errors';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph';

export interface Options {
  text: ReactNode;
  value: string;
}

export type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  emptyItemText?: string;
  hideEmptyItem?: boolean;
  hidePlaceholder?: boolean;
  options: Options[];
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  selectClassName?: string;
  selectIconClassName?: string;
  hasError?: boolean;
  label?: ReactNode;
  labelClassName?: string;
  error?: string;
  errorClassName?: string;
  errorTextClassName?: string;
  testId?: string;
  hideLabel?: boolean;
  hasErrorWrapper?: boolean;
};

export const Select = ({
  defaultValue = '',
  emptyItemText,
  hideEmptyItem,
  hidePlaceholder,
  options,
  onChange,
  className,
  selectClassName,
  selectIconClassName,
  hasError = false,
  errorClassName,
  errorTextClassName = 'mb-0 text-red-700',
  label,
  labelClassName = 'text-2xl text-gray-800',
  error,
  testId = 'select',
  hideLabel = false,
  hasErrorWrapper = false,
  id,
  ...props
}: Props) => {
  // Determine the ID to use for the select element and error message - if the user has provided an ID prop, use that; otherwise, use the testId for accessibility attributes
  const resolvedId = id || testId;
  const errorId = `${resolvedId}-error`;
  // Only apply margin if label is visible, or if error is present
  const hasTopMargin = (!!label && !hideLabel) || !!error;

  const content = (
    <>
      {label && (
        <label
          className={twMerge(labelClassName, hideLabel && 'sr-only')}
          htmlFor={resolvedId}
        >
          {label}
        </label>
      )}
      {error && (
        <Paragraph
          id={errorId}
          className={errorTextClassName}
          data-testid={errorId}
        >
          {error}
        </Paragraph>
      )}

      <div
        className={twMerge(
          'relative block focus-within:rounded focus-within:ring-[3px] focus-within:ring-yellow-400 focus-within:ring-offset-4 focus-within:ring-offset-blue-700',
          hasTopMargin && 'mt-2',
          hasError
            ? 'outline outline-2 outline-red-700 rounded-[4px] focus-within:outline-none'
            : '',
          className,
        )}
      >
        <span
          className={twMerge(
            'absolute inset-y-0 right-0 flex items-center w-10 pl-1 pr-1 text-white bg-magenta-500 rounded-r pointer-events-none print:hidden shadow-bottom-gray focus:shadow-none',
            selectIconClassName,
          )}
        >
          <Icon className="h-full" type={IconType.CHEVRON_DOWN}></Icon>
        </span>
        <select
          {...props}
          id={resolvedId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          defaultValue={!props.value ? defaultValue : undefined}
          className={twMerge(
            `${
              !hasError && 'border-gray-400 border-y border-l'
            } print:p-1 text-gray-500 appearance-none  w-full block text-md h-10 pl-3 pr-12 bg-white rounded tool-dd outline-none focus:outline-none focus:border-white`,
            selectClassName,
          )}
          onChange={onChange}
        >
          {!hideEmptyItem && (
            <option disabled hidden={hidePlaceholder} value="">
              {emptyItemText}
            </option>
          )}
          {options.map(({ text, value }) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
      </div>
    </>
  );

  // Wrap with Errors component if hasErrorWrapper is true and there is an error message
  return hasErrorWrapper && error ? (
    <Errors
      errors={[{} as ErrorType]}
      className={errorClassName}
      testId={`${resolvedId}-error-wrapper`}
    >
      {content}
    </Errors>
  ) : (
    content
  );
};
