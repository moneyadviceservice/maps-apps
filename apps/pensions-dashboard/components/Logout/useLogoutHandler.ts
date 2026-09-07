// hooks/useLogoutHandler.ts
import { KeyboardEvent, MouseEvent, useCallback, useState } from 'react';

export type ChangeEvent = MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;

const isKeyboardEvent = (
  event: ChangeEvent,
): event is React.KeyboardEvent<HTMLElement> => {
  return 'key' in event;
};

const isMouseEvent = (
  event: ChangeEvent,
): event is React.MouseEvent<HTMLElement> => {
  return !('key' in event);
};

export const isActionableEvent = (event: ChangeEvent) => {
  return (
    (isKeyboardEvent(event) &&
      ['Enter', ' ', 'Spacebar'].includes(event.key)) ||
    isMouseEvent(event)
  );
};

export const useLogoutHandler = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = useCallback((event: ChangeEvent) => {
    if (isActionableEvent(event)) {
      event.preventDefault();
      setIsLogoutModalOpen(true);
    }
  }, []);

  return {
    isLogoutModalOpen,
    setIsLogoutModalOpen,
    handleLogout,
  };
};
