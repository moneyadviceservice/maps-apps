import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { SummaryType } from 'lib/types/summary.type';

type Props = {
  children: ReactNode;
};

type SummaryContextType = {
  summary: SummaryType;
  setSummary: React.Dispatch<React.SetStateAction<SummaryType>>;
};

const SummaryContext = createContext<SummaryContextType | undefined>(undefined);

export const SummaryContextProvider = ({ children }: Props) => {
  const [summary, setSummary] = useState<SummaryType>({
    income: 0,
    spending: 0,
  });

  const value = useMemo(() => ({ summary, setSummary }), [summary, setSummary]);

  return (
    <SummaryContext.Provider value={value}>{children}</SummaryContext.Provider>
  );
};

export const useSummaryContext = () => {
  const context = useContext(SummaryContext);
  if (!context) {
    throw new Error('summaryContext must be within a Summary provider');
  }

  return context;
};
