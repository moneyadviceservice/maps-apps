import { useContext } from 'react';

import { ErrorContext } from 'context/ErrorSummaryProvider';

export const useErrorSummary = () => {
  const context = useContext(ErrorContext);

  if (context === undefined) {
    throw new Error(
      'useErrorSummary must be used within an ErrorSummaryProvider',
    );
  }

  return context;
};
