import { useEffect, useRef, useState } from 'react';

interface UseLoadingProgressProps {
  duration: number;
  durationLeft: number;
  progressComplete: string;
  onComplete?: () => void;
  intervalMs?: number;
  clearDelayMs?: number;
}

export const useLoadingProgress = ({
  duration,
  durationLeft,
  progressComplete,
  onComplete,
  intervalMs = 5000,
  clearDelayMs = 3000,
}: UseLoadingProgressProps) => {
  const [timeLeft, setTimeLeft] = useState(durationLeft);
  const [announcementText, setAnnouncementText] = useState('');
  const announcementTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);
  const progressLabelRef = useRef('');

  // 1. Keep onComplete fresh without triggering re-renders
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Calculate progress values
  const progressPercent = Math.round(((duration - timeLeft) / duration) * 100);
  const progressLabel = `${progressPercent}% ${progressComplete}${
    progressPercent === 100 ? '' : '...'
  }`;

  // Keep progress label ref in sync
  progressLabelRef.current = progressLabel;

  // 2. Handle absolute time tracking (Runs ONCE on mount)
  useEffect(() => {
    if (durationLeft <= 0) return;

    // Track the exact real-world timestamp when the countdown MUST end
    const targetEndTime = Date.now() + durationLeft * 1000;

    const timerId = setInterval(() => {
      const now = Date.now();

      // Calculate remaining time based on the system clock, not JS ticks
      const remaining = Math.max(0, Math.round((targetEndTime - now) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timerId);
      }
    }, 1000);

    return () => clearInterval(timerId);
    // We intentionally leave the dependency array empty so the interval NEVER resets
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. Handle completion trigger separately
  useEffect(() => {
    if (timeLeft <= 0) {
      const timer = setTimeout(() => {
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Handle announcements at specified intervals
  useEffect(() => {
    const announcementInterval = setInterval(() => {
      // Clear any existing timeout
      if (announcementTimeoutRef.current) {
        clearTimeout(announcementTimeoutRef.current);
      }

      // Use the current progress label from ref which is always up to date
      setAnnouncementText(progressLabelRef.current);
      announcementTimeoutRef.current = setTimeout(() => {
        setAnnouncementText('');
      }, clearDelayMs);
    }, intervalMs);

    return () => {
      clearInterval(announcementInterval);
      if (announcementTimeoutRef.current) {
        clearTimeout(announcementTimeoutRef.current);
      }
    };
  }, [intervalMs, clearDelayMs]);

  return {
    timeLeft,
    progressPercent,
    progressLabel,
    announcementText,
  };
};
