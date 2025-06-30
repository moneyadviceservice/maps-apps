import { ReactNode, useEffect, useState } from 'react';

export type Props = {
  fallback?: ReactNode;
  children?: ReactNode;
};

export const JsOnly = ({ fallback, children }: Props) => {
  const [hasHydrated, setHasHydrated] = useState(false);

  const isServer = typeof window === 'undefined';

  useEffect(() => setHasHydrated(true), []);

  if (!hasHydrated || isServer) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
