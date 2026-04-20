import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react';

/**
 * Types
 */

export type FormContextType = {
  handleSaveAndComeBack: (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => Promise<void>;
  enabledTabCount: number;
};

/**
 * FormContext
 */

const FormContext = createContext<FormContextType | undefined>(undefined);

/**
 * FormContextProvider
 */

export const FormContextProvider = ({
  children,
  handleSaveAndComeBack,
  enabledTabCount,
}: PropsWithChildren<FormContextType>) => {
  const value = useMemo(
    () => ({ handleSaveAndComeBack, enabledTabCount }),
    [handleSaveAndComeBack, enabledTabCount],
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

/**
 * useFormContext
 */

export const useFormContext = () => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error('useFormContext must be within a FormContext provider');
  }

  return context;
};
