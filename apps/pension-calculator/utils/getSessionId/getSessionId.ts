import { encryptSessionId } from 'utils/sessionToken';
import { v4 as uuidv4 } from 'uuid';

export const getSessionId = (sessionId?: string | string[]) => {
  const existing = Array.isArray(sessionId) ? sessionId[0] : sessionId;
  if (existing) {
    return existing;
  }

  return encryptSessionId(uuidv4().replaceAll('-', ''));
};
