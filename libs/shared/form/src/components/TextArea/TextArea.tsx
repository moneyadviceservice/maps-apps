import React, {
  DetailedHTMLProps,
  TextareaHTMLAttributes,
  useEffect,
  useState,
} from 'react';

import { twMerge } from 'tailwind-merge';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

export type Props = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  label?: string;
  error?: string;
  hint?: string;
  hasCharacterCounter?: boolean;
  defaultValue?: string; // Use defaultValue for uncontrolled behavior
  hasGlassBoxClass?: boolean;
};

export const TextArea = ({
  label,
  name,
  id = 'text-area',
  error,
  hint,
  minLength = 0,
  maxLength = 0,
  hasCharacterCounter = false,
  defaultValue = '', // Use defaultValue for uncontrolled behavior
  onChange,
  hasGlassBoxClass = false,
  ...props
}: Props) => {
  const { z } = useTranslation();

  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  // Set the initial state for character counter
  const [remaining, setRemaining] = useState(maxLength - defaultValue.length);

  // Update the remaining characters when defaultValue or maxLength changes
  useEffect(() => {
    setRemaining(maxLength - defaultValue.length);
  }, [defaultValue, maxLength]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    // Update the remaining characters
    setRemaining(maxLength - newValue.length);
  };

  return (
    <>
      {label && (
        <label className="block mb-4" htmlFor={id}>
          {label}
        </label>
      )}
      {hint && (
        <Paragraph
          className={twMerge('text-gray-400', error ? 'mb-2' : '')}
          data-testid={hintId}
        >
          {hint}
        </Paragraph>
      )}
      {error && (
        <Paragraph id={errorId} className="text-red-700" data-testid={errorId}>
          {error}
        </Paragraph>
      )}

      <textarea
        className={twMerge(
          hasGlassBoxClass ? 'obfuscate' : '',
          'px-3 m-px w-full rounded border resize focus:outline-none focus:shadow-focus-outline tool-field min-h-[312px] focus:border-1 focus:border-blue-700',
          error ? 'border-red-700 border-2' : 'border-gray-400',
        )}
        id={id}
        name={name}
        maxLength={maxLength}
        minLength={minLength}
        defaultValue={defaultValue} // Use defaultValue for uncontrolled behavior
        onChange={handleInputChange} // Handle input changes
        aria-label={label} // Provides an accessible label for screen readers
        aria-required={minLength > 0} // Indicates if the field is required
        aria-invalid={!!error} // Indicates if the area is invalid
        aria-errormessage={error ? errorId : undefined} // Links to the error message
        aria-describedby={hint ? hintId : undefined} // Links to the hint message
        {...props}
      />

      {hasCharacterCounter && (
        <p className="text-base text-gray-400" aria-live="polite">
          {z({
            en: `You have ${remaining.toLocaleString()} characters remaining.`,
            cy: `Mae gennych ${remaining.toLocaleString()} nodau ar ôl.`,
          })}
        </p>
      )}
    </>
  );
};
