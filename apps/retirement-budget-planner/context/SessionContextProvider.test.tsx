import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SessionContextProvider, useSessionId } from './SessionContextProvider';

describe('SessionContextProvider', () => {
  it('provides the sessionId to consumers', () => {
    const TestConsumer = () => {
      const id = useSessionId();
      return <div data-testid="session-id">{id}</div>;
    };

    render(
      <SessionContextProvider sessionId="abc-123">
        <TestConsumer />
      </SessionContextProvider>,
    );

    expect(screen.getByTestId('session-id')).toHaveTextContent('abc-123');
  });

  it('renders children correctly', () => {
    render(
      <SessionContextProvider sessionId="child-test">
        <div data-testid="child">child content</div>
      </SessionContextProvider>,
    );

    expect(screen.getByTestId('child')).toHaveTextContent('child content');
  });

  it('throws an error when useSessionId is used outside of provider', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const OutsideConsumer = () => {
      // This will throw during render because there's no provider
      useSessionId();
      return null;
    };

    try {
      expect(() => render(<OutsideConsumer />)).toThrow(
        'useSessionId must be used within a SessionIdProvider',
      );
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });

  it('allows an empty string as a valid sessionId', () => {
    const TestConsumer = () => {
      const id = useSessionId();
      return (
        <div data-testid="session-id-empty">{id === '' ? 'empty' : id}</div>
      );
    };

    render(
      <SessionContextProvider sessionId="">
        <TestConsumer />
      </SessionContextProvider>,
    );

    expect(screen.getByTestId('session-id-empty')).toHaveTextContent('empty');
  });
});
