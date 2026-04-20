import React from 'react';

import { ErrorContext } from 'context/ErrorSummaryProvider';
import { renderHook } from '@testing-library/react';

import { useErrorSummary } from './useErrorSummary';

describe('useErrorSummary', () => {
  it('should return the context value when used within an ErrorSummaryProvider', () => {
    const mockContextValue = {
      errors: { mail: ['Required'] },
      clearErrors: jest.fn(),
      setFormSummaryErrors: jest.fn(),
      setSubmittedEmail: jest.fn(),
      errorSummarySection: undefined,
      fieldErrors: {},
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ErrorContext.Provider value={mockContextValue}>
        {children}
      </ErrorContext.Provider>
    );

    const { result } = renderHook(() => useErrorSummary(), { wrapper });

    expect(result.current).toEqual(mockContextValue);
  });

  it('should throw an error when used outside of an ErrorSummaryProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      /** No empty */
    });

    expect(() => renderHook(() => useErrorSummary())).toThrow(
      'useErrorSummary must be used within an ErrorSummaryProvider',
    );

    consoleSpy.mockRestore();
  });
});
