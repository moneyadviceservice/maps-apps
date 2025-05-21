import { DATA_NOT_FOUND, REQUEST_FAILED, RESPONSE_NOT_OK } from '../constants';
import { PensionData } from '../types';
import { transformPensionData } from '../utils';

export type UserSession = {
  userSessionId: string;
  authorizationCode: string;
  scenarioEndPoint?: string;
};

type GetPensionDataType = {
  userSession: UserSession;
  skipErrors?: boolean;
};

export const getPensionData = async ({
  userSession: { userSessionId, authorizationCode, scenarioEndPoint },
}: GetPensionDataType): Promise<PensionData> => {
  try {
    const response = await fetch(
      `${process.env.MHPD_PENSION_DATA_SERVICE}/pensions-data`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          userSessionId: userSessionId,
          mhpdCorrelationId: userSessionId,
          cookie: `userSessionId=${userSessionId}; authorizationCode=${authorizationCode}; scenarioEndPoint=${scenarioEndPoint};`,
        },
        signal: new AbortController().signal,
      },
    );

    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(RESPONSE_NOT_OK);
    }

    const data: PensionData = await response.json();

    // If the data is not found, throw an error
    if (!data) {
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
    console.error(REQUEST_FAILED, error);
    throw error;
  }
};
