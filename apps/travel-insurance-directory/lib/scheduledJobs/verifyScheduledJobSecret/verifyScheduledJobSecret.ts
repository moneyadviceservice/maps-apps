import { timingSafeEqual } from 'node:crypto';

export const verifyScheduledJobSecret = (
  receivedSecret?: string | string[],
): boolean => {
  const expectedSecret = process.env.VALIDATE_FIRM_API_SECRET ?? '';
  const provided = Array.isArray(receivedSecret)
    ? receivedSecret[0]
    : receivedSecret;

  if (expectedSecret?.length !== provided?.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(provided), Buffer.from(expectedSecret));
};
