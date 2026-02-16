import { JWTVerifyResult } from 'jose';

export const checkSessionValidity = async (
  userSession: JWTVerifyResult<Record<string, unknown>>,
): Promise<boolean> => {
  if (!userSession) {
    return false;
  }

  const referrerId = userSession?.payload?.referrerId as string;
  const correlationId = userSession?.payload?.correlationId as string;
  const orgConfirmed = userSession?.payload?.organisationConfirmed as boolean;
  const orgName = userSession?.payload?.organisationName as string;
  const isLoggingIn = userSession?.payload?.loggingIn as boolean;

  if (
    isLoggingIn ||
    !referrerId ||
    !correlationId ||
    referrerId.length < 8 ||
    referrerId.length > 11 ||
    (orgConfirmed && orgName?.length < 1)
  ) {
    return false;
  }

  return true;
};
