import { JWTVerifyResult } from 'jose';

export const hasRefreshTimeExpired = async (
  userSession: JWTVerifyResult<Record<string, unknown>>,
): Promise<boolean> => {
  const currentDateTime = new Date();

  const sessionRefreshTime = new Date(
    userSession?.payload?.sessionRefreshTime as string,
  );

  return sessionRefreshTime.getTime() <= currentDateTime.getTime();
};
