import { BACKEND_TIMEOUT_SECONDS } from '../constants';

export const isSessionExpired = async (
  sessionStart?: string,
): Promise<boolean> => {
  if (!sessionStart || sessionStart === '') {
    return false;
  }

  const sessionStartTime = parseInt(sessionStart);
  const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);

  return sessionDuration >= BACKEND_TIMEOUT_SECONDS;
};
