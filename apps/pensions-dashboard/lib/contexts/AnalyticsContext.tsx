import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type AnalyticsContextType = {
  userSessionId: string;

  setUserSessionId: (sessionId: string) => void;
};

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

type AnalyticsProviderProps = {
  children: ReactNode;
  initialUserSessionId?: string;
};

export const AnalyticsProvider = ({
  children,
  initialUserSessionId = '',
}: AnalyticsProviderProps) => {
  const [userSessionId, setUserSessionId] = useState(initialUserSessionId);

  const setSessionId = useCallback((sessionId: string) => {
    setUserSessionId(sessionId);
  }, []);

  useEffect(() => {
    if (initialUserSessionId !== userSessionId) {
      setSessionId(initialUserSessionId);
    }
  }, [initialUserSessionId, userSessionId, setSessionId]);

  const value = useMemo(
    () => ({
      userSessionId,
      setUserSessionId: setSessionId,
    }),
    [userSessionId, setSessionId],
  );

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalyticsProvider = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error(
      'useAnalyticsProvider must be used within an AnalyticsProvider',
    );
  }
  return context;
};
