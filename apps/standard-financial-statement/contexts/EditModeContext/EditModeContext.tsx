import {
  createContext,
  FormEvent,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

import { useRouter } from 'next/router';

import { organisationFormObject } from '../../utils/organisations/formatFormObjects/organisationFormObject';

interface EditModeContextProps {
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  handleCancel: () => void;
  handleSave: (e: FormEvent<HTMLFormElement>) => void;
}

const EditModeContext = createContext<EditModeContextProps | null>(null);

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (!context)
    throw new Error('useEditMode must be used within ToggleEditMode');
  return context;
};

export const ToggleEditProvider = ({
  licence_number,
  children,
}: {
  licence_number?: string;
  children: ReactNode;
}) => {
  const router = useRouter();

  const [isEditMode, setIsEditMode] = useState(false);

  const handleCancel = () => setIsEditMode(false);
  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!licence_number) {
        throw new Error('Missing required fields to update the record');
      }

      const form = e?.target as HTMLFormElement;
      const formData = new FormData(form);

      const payload = organisationFormObject(formData);

      const res = await fetch('/api/update-organisation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licence_number, payload }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error ?? 'Failed to update organisation');
      }

      setIsEditMode(false);

      router.replace(router.asPath);
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  const contextValue = useMemo(
    () => ({
      isEditMode,
      setIsEditMode,
      handleCancel,
      handleSave,
    }),
    [isEditMode],
  );

  return (
    <EditModeContext.Provider value={contextValue}>
      {isEditMode ? <form onSubmit={handleSave}>{children}</form> : children}
    </EditModeContext.Provider>
  );
};
