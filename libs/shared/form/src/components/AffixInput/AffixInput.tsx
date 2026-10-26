import { ReactNode, useId } from 'react';

import { twMerge } from 'tailwind-merge';

import { Errors } from '@maps-react/common/components/Errors';
import { Paragraph } from '@maps-react/common/components/Paragraph';

import type { Props as NumberInputProps } from '../NumberInput';
import { NumberInput } from '../NumberInput';

export type AffixInputProps = Omit<NumberInputProps, 'prefix' | 'suffix'> & {
  variant: 'money' | 'percent';
  label?: ReactNode;
  labelClassName?: string;
  hint?: string;
  hintClassName?: string;
  error?: string;
  hasError?: boolean;
  hasErrorWrapper?: boolean;
  addon?: string;
  addonClassName?: string;
  inputClassName?: string;
  containerClassName?: string;
  inputBackground?: string;
};

export const AffixInput = ({
  variant,
  className,
  id: providedId,
  label,
  labelClassName,
  hint,
  hintClassName,
  error,
  hasError: hasErrorProp = false,
  hasErrorWrapper = false,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
  inputClassName,
  containerClassName,
  addon,
  addonClassName,
  inputBackground,
  inputMode,
  thousandSeparator,
  decimalScale,
  maxValue,
  isAllowed,
  ...props
}: AffixInputProps) => {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const isMoney = variant === 'money';
  const isPercent = variant === 'percent';
  const fieldHasError = Boolean(error || hasErrorProp);
  const borderClass = fieldHasError
    ? 'border-red-700 border-2'
    : 'border-gray-400 border';

  const describedBy = [hint && hintId, error && errorId, ariaDescribedBy]
    .filter(Boolean)
    .join(' ');

  const content = (
    <div className={twMerge('flex flex-col', containerClassName)}>
      {label && (
        <label
          className={twMerge('block text-2xl', labelClassName)}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      {hint && (
        <Paragraph
          id={hintId}
          className={twMerge('mb-0 text-gray-650', hintClassName)}
          data-testid={hintId}
        >
          {hint}
        </Paragraph>
      )}
      {error && (
        <Paragraph
          id={errorId}
          className="mb-2 text-red-700"
          data-testid={errorId}
        >
          {error}
        </Paragraph>
      )}

      <div className="flex">
        <div className={twMerge('relative', inputClassName)}>
          <NumberInput
            {...props}
            id={id}
            inputMode={inputMode ?? (isMoney ? 'numeric' : 'decimal')}
            thousandSeparator={
              thousandSeparator ?? (isMoney ? true : undefined)
            }
            {...(decimalScale !== undefined || isMoney
              ? { decimalScale: decimalScale ?? 2 }
              : {})}
            maxValue={maxValue ?? (isMoney ? 999999999 : 100)}
            {...(isAllowed ? { isAllowed } : {})}
            aria-invalid={fieldHasError ? true : ariaInvalid}
            aria-describedby={describedBy || undefined}
            className={twMerge(
              'peer py-[8px] rounded focus:border-blue-700',
              borderClass,
              isMoney && 'pl-[43px]',
              isMoney && addon && 'pr-12',
              isPercent && 'pr-12',
              inputBackground,
              className,
            )}
          />

          {isMoney && (
            <span
              aria-hidden
              className={twMerge(
                'absolute bg-gray-100 top-0 left-0 py-2 px-3 rounded-l border-solid flex items-center text-[18px] h-full peer-focus:border-blue-700 peer-focus:border-r-gray-400',
                borderClass,
                'border-r border-r-gray-400',
              )}
            >
              £
            </span>
          )}

          {isPercent && (
            <span
              aria-hidden
              className={twMerge(
                'absolute top-0 right-0 bg-gray-100 px-3 h-full rounded-r border-solid justify-center flex items-center peer-focus:border-blue-700 peer-focus:border-l-gray-400',
                borderClass,
                'border-l border-l-gray-400',
              )}
            >
              %
            </span>
          )}

          {isMoney && addon && (
            <span
              aria-hidden
              className={twMerge(
                'absolute top-0 right-0 px-3 py-2 bg-gray-100 border-solid rounded-r text-nowrap h-full text-[18px]',
                borderClass,
                'border-l border-l-gray-400',
                addonClassName,
              )}
            >
              {addon}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return hasErrorWrapper && error ? (
    <Errors errors={[error]}>{content}</Errors>
  ) : (
    content
  );
};
