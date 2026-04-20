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
  const timeLeftRef = useRef(durationLeft);
  const progressLabelRef = useRef('');

  // Handle countdown timer
  useEffect(() => {
    // Always keep ref in sync
    timeLeftRef.current = timeLeft;

    if (timeLeft <= 0) {
      if (onComplete) {
        const timer = setTimeout(() => {
          onComplete();
        }, 2000);
        return () => clearTimeout(timer);
      }
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = Math.max(prevTime - 1, 0);
        timeLeftRef.current = newTime; // Update ref immediately
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onComplete]);

  // Calculate progress values
  const progressPercent = Math.round(((duration - timeLeft) / duration) * 100);
  const progressLabel = `${progressPercent}% ${progressComplete}${
    progressPercent === 100 ? '' : '...'
  }`;

  // Keep progress label ref in sync
  progressLabelRef.current = progressLabel;

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
