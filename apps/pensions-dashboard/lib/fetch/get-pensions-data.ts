import {
  DATA_NOT_FOUND,
  REQUEST_FAILED,
  RESPONSE_NOT_OK,
  SESSION_EXPIRED,
} from '../constants';
import { PensionData } from '../types';
import { isSessionExpired, logger, transformPensionData } from '../utils';

export type UserSession = {
  userSessionId: string;
  authorizationCode: string;
  sessionStart?: string;
};

type GetPensionDataType = {
  userSession: UserSession;
  skipErrors?: boolean;
};

export const getPensionData = async ({
  userSession,
}: GetPensionDataType): Promise<PensionData> => {
  const expired = await isSessionExpired(userSession.sessionStart);

  if (expired) {
    logger.error({ message: 'Session has expired', session: userSession });
    throw new Error(SESSION_EXPIRED);
  }

  try {
    const response = await fetch(
      `${process.env.MHPD_PENSION_DATA_SERVICE}/pensions-data`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          userSessionId: userSession.userSessionId,
          mhpdCorrelationId: userSession.userSessionId,
          cookie: `userSessionId=${userSession.userSessionId}; authorizationCode=${userSession.authorizationCode};`,
        },
        signal: new AbortController().signal,
      },
    );

    // If the response is not ok, throw an error
    if (!response.ok) {
      logger.error({
        message: 'Failed to fetch pension data',
        session: userSession,
        data: { status: response.status },
      });
      throw new Error(RESPONSE_NOT_OK);
    }

    const data: PensionData = await response.json();

    // If the data is not found, throw an error
    if (!data) {
      logger.error({
        message: 'Pension data not found',
        session: userSession,
      });
      throw new Error(DATA_NOT_FOUND);
    }

    // Transform the pension data
    data.pensionPolicies.forEach((policy) => {
      policy.pensionArrangements.forEach((pension) =>
        transformPensionData(pension),
      );
    });

    return data;
  } catch (error) {
    logger.error({
      message: REQUEST_FAILED,
      data: error,
      session: userSession,
    });
    console.error(REQUEST_FAILED, error);
    throw error;
  }
};
