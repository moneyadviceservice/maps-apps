import { ReactNode } from 'react';

import { useErrorSummary } from 'hooks/useErrorSummary';

import { Errors } from '@maps-react/common/components/Errors';

type FieldErrorProps = {
  fieldKey: string;
  className?: string;
  children: ReactNode;
};

export const FieldError = ({
  fieldKey,
  className,
  children,
}: FieldErrorProps) => {
  const { fieldErrors } = useErrorSummary();

  const error = fieldErrors?.[fieldKey]?.[0];

  return (
    <Errors
      errors={error ? [error] : undefined}
      testId={`error-${fieldKey}`}
      id={fieldKey}
      className={className}
    >
      {error && (
        <div
          className="text-red-700 text-[18px] my-1"
          aria-describedby={fieldKey}
          data-testid={`${fieldKey}-error`}
        >
          {error}
        </div>
      )}

      {children}
    </Errors>
  );
};
