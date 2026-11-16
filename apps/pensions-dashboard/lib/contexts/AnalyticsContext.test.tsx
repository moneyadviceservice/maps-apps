import { render, screen } from '@testing-library/react';

import { AnalyticsProvider, useAnalyticsProvider } from './AnalyticsContext';

import '@testing-library/jest-dom';

// Test component to use the context
const TestComponent = () => {
  const { userSessionId, setUserSessionId } = useAnalyticsProvider();

  return (
    <div>
      <span data-testid="session-id">{userSessionId}</span>
      <button
        data-testid="set-session-button"
        onClick={() => setUserSessionId('new-session-id')}
      >
        Set Session ID
      </button>
    </div>
  );
};

// Component to test functional updates
const TestFunctionalComponent = () => {
  const context = useAnalyticsProvider();

  return (
    <div>
      <span data-testid="session-id">{context.userSessionId}</span>
      <span data-testid="has-function">{typeof context.setUserSessionId}</span>
      <button
        data-testid="update-button"
        onClick={() => {
          context.setUserSessionId('updated-session');
        }}
      >
        Update
      </button>
    </div>
  );
};

// Component to test error handling
const TestComponentWithoutProvider = () => {
  try {
    useAnalyticsProvider();
    return <div>Should not render</div>;
  } catch (error) {
    return <div data-testid="error-message">{(error as Error).message}</div>;
  }
};

describe('AnalyticsProvider', () => {
  it('should provide default empty session ID when no initial value is provided', () => {
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>,
    );

    expect(screen.getByTestId('session-id')).toHaveTextContent('');
  });

  it('should provide initial session ID when provided', () => {
    const initialSessionId = 'initial-session-123';

    render(
      <AnalyticsProvider initialUserSessionId={initialSessionId}>
        <TestComponent />
      </AnalyticsProvider>,
    );

    expect(screen.getByTestId('session-id')).toHaveTextContent(
      initialSessionId,
    );
  });

  it('should provide functional setUserSessionId', () => {
    render(
      <AnalyticsProvider>
        <TestFunctionalComponent />
      </AnalyticsProvider>,
    );

    expect(screen.getByTestId('has-function')).toHaveTextContent('function');
  });

  it('should update session ID when initialUserSessionId prop changes', () => {
    const initialSessionId = 'initial-session-123';
    const updatedSessionId = 'updated-session-456';

    const { rerender } = render(
      <AnalyticsProvider initialUserSessionId={initialSessionId}>
        <TestComponent />
      </AnalyticsProvider>,
    );

    expect(screen.getByTestId('session-id')).toHaveTextContent(
      initialSessionId,
    );

    rerender(
      <AnalyticsProvider initialUserSessionId={updatedSessionId}>
        <TestComponent />
      </AnalyticsProvider>,
    );

    expect(screen.getByTestId('session-id')).toHaveTextContent(
      updatedSessionId,
    );
  });

  it('should render children correctly', () => {
    const testContent = 'Test child content';

    render(
      <AnalyticsProvider>
        <div data-testid="child-content">{testContent}</div>
      </AnalyticsProvider>,
    );

    expect(screen.getByTestId('child-content')).toHaveTextContent(testContent);
  });
});

describe('useAnalyticsProvider', () => {
  it('should throw error when used outside of AnalyticsProvider', () => {
    // Spy on console.error to suppress error output in tests
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    render(<TestComponentWithoutProvider />);

    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'useAnalyticsProvider must be used within an AnalyticsProvider',
    );

    consoleSpy.mockRestore();
  });

  it('should return correct context values and functions', () => {
    const sessionId = 'test-session-id';

    render(
      <AnalyticsProvider initialUserSessionId={sessionId}>
        <TestComponent />
      </AnalyticsProvider>,
    );

    expect(screen.getByTestId('session-id')).toHaveTextContent(sessionId);
    expect(screen.getByTestId('set-session-button')).toBeInTheDocument();
  });
});

describe('State management', () => {
  it('should work with nested providers (should use closest provider)', () => {
    const NestedTestComponent = () => {
      const { userSessionId } = useAnalyticsProvider();
      return <span data-testid="nested-session-id">{userSessionId}</span>;
    };

    render(
      <AnalyticsProvider initialUserSessionId="outer-session">
        <AnalyticsProvider initialUserSessionId="inner-session">
          <NestedTestComponent />
        </AnalyticsProvider>
      </AnalyticsProvider>,
    );

    expect(screen.getByTestId('nested-session-id')).toHaveTextContent(
      'inner-session',
    );
  });

  it('should handle prop updates with useEffect', () => {
    const TestEffectComponent = () => {
      const { userSessionId } = useAnalyticsProvider();
      return <span data-testid="session-id">{userSessionId}</span>;
    };

    const { rerender } = render(
      <AnalyticsProvider initialUserSessionId="first">
        <TestEffectComponent />
      </AnalyticsProvider>,
    );

    expect(screen.getByTestId('session-id')).toHaveTextContent('first');

    rerender(
      <AnalyticsProvider initialUserSessionId="second">
        <TestEffectComponent />
      </AnalyticsProvider>,
    );

    expect(screen.getByTestId('session-id')).toHaveTextContent('second');
  });
});
