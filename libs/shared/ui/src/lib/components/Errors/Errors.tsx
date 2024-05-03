import { ReactNode } from 'react';
import classNames from 'classnames';

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
      className={classNames({
        'border-0 border-l-4 pl-5 border-red-700 border-solid': hasErrors,
      })}
    >
      {children}
    </div>
  );
};
