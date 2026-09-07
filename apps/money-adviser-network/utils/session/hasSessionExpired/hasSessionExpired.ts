import { JWTVerifyResult } from 'jose';

export const hasSessionExpired = async (
  userSession: JWTVerifyResult<Record<string, unknown>>,
): Promise<boolean> => {
  const currentDateTime = new Date();

  const sessionExpireDateTime = new Date(
    userSession?.payload?.expires as string,
  );

  return sessionExpireDateTime.getTime() <= currentDateTime.getTime();
};
