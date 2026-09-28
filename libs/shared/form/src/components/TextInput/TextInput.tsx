import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

import { twMerge } from 'tailwind-merge';

import { Errors } from '@maps-react/common/components/Errors';
import { Paragraph } from '@maps-react/common/components/Paragraph';

export type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label?: string;
  error?: string;
  hint?: string;
  hasGlassBoxClass?: boolean;
  hasErrorWrapper?: boolean;
  containerClassName?: string;
  children?: React.ReactNode;
};

export const TextInput = ({
  label,
  name,
  id = 'text-input',
  error,
  hint,
  hasGlassBoxClass = false,
  className,
  containerClassName,
  hasErrorWrapper = false,
  children,
  'aria-describedby': ariaDescribedBy,
  ...props
}: Props) => {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [hint && hintId, error && errorId, ariaDescribedBy]
    .filter(Boolean)
    .join(' ');

  const content = (
    <div className={twMerge('text-base', containerClassName)}>
      {label && (
        <label className="block text-2xl" htmlFor={id}>
          {label}
        </label>
      )}
      {hint && (
        <Paragraph
          id={hintId}
          className={twMerge('mb-0 text-gray-650')}
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
      <input
        className={twMerge(
          hasGlassBoxClass ? 'obfuscate' : '',
          'px-3 m-px mt-2 w-full h-10 rounded border focus:outline-none focus:shadow-focus-outline tool-field focus:border-1 focus:border-blue-700',
          error ? 'border-red-700 border-2' : 'border-gray-400',
          className,
        )}
        id={id}
        name={name}
        type="text"
        aria-invalid={!!error}
        aria-describedby={describedBy || undefined}
        {...props}
      />
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
  return hasErrorWrapper && error ? (
    <Errors errors={[error]}>{content}</Errors>
  ) : (
    content
  );
};
