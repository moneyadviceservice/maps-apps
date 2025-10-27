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
  className,
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
          hasGlassBoxClass ? 'obfuscate' : '',
          'px-3 m-px w-full h-10 rounded border focus:outline-none focus:shadow-focus-outline tool-field focus:border-1 focus:border-blue-700',
          error ? 'border-red-700 border-2' : 'border-gray-400',
          className,
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
