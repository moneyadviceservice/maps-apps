import { createContext, useContext } from 'react';

const SessionIdContext = createContext<string | null>(null);

export const SessionContextProvider = ({
  children,
  sessionId,
}: {
  children: React.ReactNode;
  sessionId: string;
}) => {
  return (
    <SessionIdContext.Provider value={sessionId}>
      {children}
    </SessionIdContext.Provider>
  );
};

export const useSessionId = () => {
  const context = useContext(SessionIdContext);
  if (context === null) {
    throw new Error('useSessionId must be used within a SessionIdProvider');
  }
  return context;
};
