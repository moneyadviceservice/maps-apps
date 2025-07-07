'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

const BudgetPlannerContext = createContext<{
  dataInContext: { [key: string]: Record<string, string> };
  setDataInContext: (prevState: {
    [key: string]: Record<string, string>;
  }) => void;
}>({
  dataInContext: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDataInContext: (): void => {},
});

export const BudgetPlannerDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [dataInContext, setDataInContext] = useState<{
    [key: string]: Record<string, string>;
  }>({});

  const value = useMemo(
    () => ({ dataInContext, setDataInContext }),
    [dataInContext, setDataInContext],
  );

  return (
    <BudgetPlannerContext.Provider value={value}>
      {children}
    </BudgetPlannerContext.Provider>
  );
};

export const useBudgetPlannerProvider = () => {
  const value = useContext(BudgetPlannerContext);
  if (!value) {
    throw new Error(
      'useBudgetPlannerProvider must be used within a BudgetPlannerDataProvider',
    );
  }
  return value;
};
