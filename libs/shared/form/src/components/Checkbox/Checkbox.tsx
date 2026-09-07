import {
  CSSProperties,
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
} from 'react';

import { twMerge } from 'tailwind-merge';

import { Errors } from '@maps-react/common/components/Errors/Errors';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph/Paragraph';

export type CheckboxGroupItem = {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
};

export type CheckboxProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  checkboxClassName?: string;
  hasError?: boolean;
  labelTestId?: string;
  hint?: ReactNode;
  errorMessageId?: string;
};

const baseClasses = `
  flex items-center justify-center flex-none w-10 h-10 p-1
  bg-white border border-gray-400 rounded text-white
`;

const checkedClasses = `
  peer-checked:bg-magenta-500 peer-checked:text-white peer-checked:border-magenta-500
`;

const focusClasses = `
  peer-focus:border-4 peer-focus:border-blue-700 peer-focus:ring-[3px] peer-focus:ring-yellow-400
`;

const hoverClasses = `
  peer-checked:hover:bg-pink-800 peer-checked:hover:border-pink-800 peer-checked:hover:text-white
`;

const activeClasses = `
  active:bg-pink-400 active:border-pink-400 active:text-white
  peer-checked:active:bg-pink-400 peer-checked:active:border-pink-400
`;

const disabledClasses = `
  peer-disabled:bg-slate-400
  peer-disabled:border-slate-400 
  peer-disabled:text-slate-400
  peer-disabled:cursor-not-allowed
`;

const getErrorClasses = (hasError?: boolean) => {
  if (!hasError) return '';
  return `
    border-4 border-red-700
    peer-checked:bg-red-700 peer-checked:border-red-700
    `;
};

type CheckboxItemProps = InputHTMLAttributes<HTMLInputElement> & {
  /** @deprecated Prefer using className for styling. Only use for one-off inline styles if absolutely necessary. */
  style?: CSSProperties;
  className?: string;
  labelTestId?: string;
  checkboxClassName?: string;
  hasError?: boolean;
  children?: ReactNode;
  hint?: ReactNode;
  errorMessageId?: string;
};

const CheckboxItem = ({
  children,
  style,
  className,
  checkboxClassName,
  hasError,
  labelTestId = 'checkbox',
  hint,
  errorMessageId,
  ...rest
}: CheckboxItemProps) => {
  const errorClasses = getErrorClasses(hasError);
  const hintId = `${labelTestId}-hint`;
  const errorId = errorMessageId || `${labelTestId}-error`;
  const describedBy = [hint ? hintId : null, hasError ? errorId : null]
    .filter(Boolean)
    .join(' ');

  return (
    <label
      style={style}
      className={twMerge('flex', className)}
      data-testid={labelTestId}
    >
      <input
        type="checkbox"
        className="sr-only peer tool-cbox"
        aria-invalid={!!hasError || undefined}
        aria-describedby={describedBy || undefined}
        {...rest}
      />
      <div
        className={twMerge(
          baseClasses,
          checkedClasses,
          focusClasses,
          hoverClasses,
          activeClasses,
          errorClasses,
          disabledClasses,
          checkboxClassName,
        )}
      >
        <Icon
          className="w-6 h-5"
          role="presentation"
          type={IconType.TICK_SQUARE}
        />
      </div>
      <div className="flex flex-col ml-3">
        <p
          className="flex items-center text-base min-h-10"
          data-testid={`${labelTestId}-children`}
        >
          {children}
        </p>
        {hint && (
          <Paragraph
            id={hintId}
            className="mb-0 text-base text-gray-600"
            data-testid={hintId}
          >
            {hint}
          </Paragraph>
        )}
      </div>
    </label>
  );
};

export type CheckboxGroupProps = {
  name: string;
  items: CheckboxGroupItem[];
  /** The `<legend>` for the group. Screen readers announce this before each item. Use `hideLabel` to visually hide it. */
  label: ReactNode;
  /** Values that should be selected on first render. */
  defaultChecked?: string[];
  children?: ReactNode;
  className?: string;
  checkboxClassName?: string;
  testId?: string;
  hideLabel?: boolean;
  hint?: ReactNode;
  error?: string;
  /** Wrap the group with `Errors` component for default error-summary behavior. */
  hasErrorWrapper?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * A group of checkboxes with built-in accessibility features, error handling, and support for additional content. Use `CheckboxGroup` instead of `Checkbox` for the new UI.
 *
 * Features:
 * - **Fieldset/legend**: Wraps checkboxes in a fieldset with a legend for better semantics and screen reader support
 * - **Group hints**: Optional group-level hint text displayed under the legend
 * - **Validation**: Error prop shows error message and applies error styling to all checkboxes
 * - **Expandable children**: Support for additional content below the group
 * - **Accessibility**: Fieldset/legend, aria-describedby, full keyboard support, screen reader friendly
 * - **Prefill support**: Use 'defaultChecked' array to hydrate from stored values
 *
 * @example see CheckboxGroup.stories.tsx for interactive examples and usage guidance.
 * @param param0
 * @returns
 */
export const CheckboxGroup = ({
  name,
  items,
  defaultChecked,
  children,
  className,
  checkboxClassName,
  testId = 'checkbox-group',
  hideLabel,
  label,
  hint,
  error,
  hasErrorWrapper = false,
  onChange,
}: CheckboxGroupProps) => {
  const hintId = `${testId}-hint`;
  const errorId = `${testId}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ');

  const content = (
    <div className={twMerge('text-base', className)} data-testid={testId}>
      <fieldset aria-describedby={describedBy || undefined}>
        {label && (
          <legend
            className={twMerge(
              'text-2xl text-gray-800',
              hideLabel && 'sr-only',
            )}
          >
            {label}
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
        {items.map((item) => (
          <CheckboxItem
            key={item.value}
            className="mt-4"
            checkboxClassName={checkboxClassName}
            hasError={!!error}
            labelTestId={`${testId}-${item.value}`}
            name={name}
            value={item.value}
            disabled={item.disabled}
            defaultChecked={!!defaultChecked?.includes(item.value)}
            hint={item.hint}
            errorMessageId={errorId}
            onChange={onChange}
          >
            {item.label}
          </CheckboxItem>
        ))}
      </fieldset>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );

  if (!hasErrorWrapper) return content;

  return <Errors errors={error ? [error] : null}>{content}</Errors>;
};

/**
 * @deprecated Use `CheckboxGroup` for single or multiple checkboxes with
 * fieldset/legend semantics, pre-fill support, and accessibility features.
 */
export const Checkbox = ({
  children,
  style,
  className,
  checkboxClassName,
  hasError,
  labelTestId,
  hint,
  errorMessageId,
  ...rest
}: CheckboxProps) => (
  <CheckboxItem
    style={style}
    className={className}
    labelTestId={labelTestId}
    checkboxClassName={checkboxClassName}
    hasError={hasError}
    hint={hint}
    errorMessageId={errorMessageId}
    {...rest}
  >
    {children}
  </CheckboxItem>
);
