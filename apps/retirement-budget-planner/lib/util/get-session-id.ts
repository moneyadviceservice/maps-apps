import { v4 as uuidv4 } from 'uuid';
export const getSessionId = (sessionId: string | undefined) => {
  let generatedSessionId = sessionId?.toString();
  if (!generatedSessionId) {
    generatedSessionId = uuidv4().replace(/-/g, '');
  }
  return generatedSessionId;
};
