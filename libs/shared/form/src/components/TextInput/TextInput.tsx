import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

import { twMerge } from 'tailwind-merge';

import { Paragraph } from '@maps-react/common/components/Paragraph';
export type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label?: string;
  error?: string;
  hint?: string;
  hasGlassBoxClass?: boolean;
};

export const TextInput = ({
  label,
  name,
  id = 'text-input',
  error,
  hint,
  hasGlassBoxClass = false,
  ...props
}: Props) => {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <>
      {label && (
        <label className="block pb-2 text-lg" htmlFor={id}>
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
      <input
        className={twMerge(
          error ? 'border-red-700' : 'border-gray-400',
          hasGlassBoxClass ? 'obfuscate' : '',
          'w-full h-10 px-3 m-px border rounded focus:outline-purple-700 focus:shadow-focus-outline tool-field',
        )}
        id={id}
        name={name}
        type="text"
        aria-invalid={!!error} // Indicates if the field is invalid
        aria-describedby={error ? errorId : undefined} // Links to the error message
        {...props}
      />
    </>
  );
};
