import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useLanguage } from '@maps-react/hooks/useLanguage';

import { TimeoutModal } from '../TimeoutModal/TimeoutModal';

type TimeoutProps = {
  duration: number;
  modalDuration: number;
  setIsLogoutModalOpen?: Dispatch<SetStateAction<boolean>>;
};

export const Timeout = ({
  duration,
  modalDuration,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsLogoutModalOpen = () => {},
}: TimeoutProps) => {
  const language = useLanguage();
  const [jsEnabled, setJsEnabled] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // Use useState for startTime so components can react to changes
  const [startTime, setStartTime] = useState<number>(Date.now());

  const restartTimer = useCallback(() => {
    setStartTime(Date.now());
    setTimedOut(false);
  }, []);

  const onInteraction = useCallback(() => {
    if (!timedOut) {
      restartTimer();
    }
  }, [timedOut, restartTimer]);

  useEffect(() => {
    setJsEnabled(true);
  }, []);

  useEffect(() => {
    if (!jsEnabled) return; // Don't start timer until JS is confirmed enabled

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        setTimedOut(true); // Show modal when time elapses
      }
    }, 100); // Check every 100ms

    window.addEventListener('mousemove', onInteraction);
    window.addEventListener('keydown', onInteraction);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', onInteraction);
      window.removeEventListener('keydown', onInteraction);
    };
  }, [duration, jsEnabled, onInteraction, startTime]);

  const handleCloseModal = (e: SyntheticEvent) => {
    e.preventDefault();
    restartTimer(); // Restart timer when modal is closed
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      {timedOut && (
        <TimeoutModal
          isOpen={timedOut}
          onCloseClick={handleCloseModal}
          modalTimeout={modalDuration}
        />
      )}
      {!jsEnabled && (
        <noscript data-testid="noscript-refresh">
          <meta
            httpEquiv="refresh"
            content={`${
              duration / 1000
            };url=/${language}/you-have-been-inactive-for-a-while`}
          />
        </noscript>
      )}
    </>
  );
};
