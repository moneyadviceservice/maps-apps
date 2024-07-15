import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export type ErrorType = {
  question: number;
  message: string;
};

export type ErrorsProps = {
  children: ReactNode;
  testId?: string;
  errors: Array<ErrorType | string>;
};

export const Errors = ({
  children,
  testId = 'errors',
  errors,
}: ErrorsProps) => {
  const hasErrors = errors && errors.length > 0;

  return (
    <div
      data-testid={testId}
      className={twMerge(
        hasErrors && ['border-0 border-l-4 pl-5 border-red-700 border-solid'],
      )}
    >
      {children}
    </div>
  );
};
