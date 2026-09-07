import React, {
  DetailedHTMLProps,
  ReactNode,
  TextareaHTMLAttributes,
  useEffect,
  useState,
} from 'react';

import { twMerge } from 'tailwind-merge';

import { Errors } from '@maps-react/common/components/Errors/Errors';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

export type Props = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  characterLimitText?: ReactNode;
  hasCharacterCounter?: boolean;
  // Use defaultValue for uncontrolled behavior
  defaultValue?: string;
  hasGlassBoxClass?: boolean;
  // Optional prop to wrap with Errors component - some usages may not want this
  hasErrorWrapper?: boolean;
  hideLabel?: boolean;
};

export const TextArea = ({
  label,
  name,
  id = 'text-area',
  error,
  hint,
  characterLimitText,
  minLength = 0,
  maxLength = 0,
  hasCharacterCounter = false,
  defaultValue = '',
  onChange,
  hasGlassBoxClass = false,
  hasErrorWrapper = false,
  hideLabel = false,
  ...props
}: Props) => {
  const { z } = useTranslation();

  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const characterLimitTextId = `${id}-character-limit-text`;
  const characterCounterId = `${id}-character-counter`;

  // Only apply margin if label is visible, or if hint or error is present
  const hasTopMargin = !hideLabel || !!hint || !!error;

  const describedBy = [
    hint ? hintId : null,
    error ? errorId : null,
    characterLimitText ? characterLimitTextId : null,
    hasCharacterCounter ? characterCounterId : null,
  ]
    .filter(Boolean)
    .join(' ');

  // Set the initial state for character counter
  const [remaining, setRemaining] = useState(maxLength - defaultValue.length);

  // Update the remaining characters when defaultValue or maxLength changes
  useEffect(() => {
    setRemaining(maxLength - defaultValue.length);
  }, [defaultValue, maxLength]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    if (hasCharacterCounter) {
      setRemaining(maxLength - newValue.length);
    }

    onChange?.(e);
  };

  const content = (
    <>
      <label
        className={twMerge('text-2xl text-gray-800', hideLabel && 'sr-only')}
        htmlFor={id}
      >
        {label}
      </label>
      {hint && (
        <Paragraph
          id={hintId}
          className="mb-0 text-gray-650"
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

      <textarea
        className={twMerge(
          hasGlassBoxClass ? 'obfuscate' : '',
          'px-3 mx-px mb-px w-full rounded border resize focus:outline-none focus:shadow-focus-outline tool-field min-h-[312px] focus:border-1 focus:border-blue-700',
          error ? 'border-red-700 border-2' : 'border-gray-400',
          hasTopMargin && 'mt-2',
        )}
        id={id}
        name={name}
        maxLength={maxLength}
        minLength={minLength}
        defaultValue={defaultValue} // Use defaultValue for uncontrolled behavior
        onChange={
          hasCharacterCounter || onChange ? handleInputChange : undefined
        }
        aria-required={minLength > 0} // Indicates if the field is required
        aria-invalid={!!error} // Indicates if the area is invalid
        aria-errormessage={error ? errorId : undefined} // Links to the error message
        aria-describedby={describedBy || undefined} // Links to hint, error, and counter text
        {...props}
      />

      {characterLimitText && (
        <p id={characterLimitTextId} className="text-base text-gray-650 mb-0">
          {characterLimitText}
        </p>
      )}

      {hasCharacterCounter && (
        <p
          id={characterCounterId}
          className="text-base text-gray-650"
          aria-live="polite"
        >
          {z({
            en: `You have ${remaining.toLocaleString()} characters remaining.`,
            cy: `Mae gennych ${remaining.toLocaleString()} nodau ar ôl.`,
          })}
        </p>
      )}
    </>
  );

  return hasErrorWrapper && error ? (
    <Errors errors={[error]}>{content}</Errors>
  ) : (
    content
  );
};
