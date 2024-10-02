import { PensionData } from '../types';
import { transformPensionData } from '../utils';

export type UserSession = {
  userSessionId: string;
  authorizationCode: string;
};

export const getPensionData = async ({
  userSessionId,
  authorizationCode,
}: UserSession): Promise<PensionData> => {
  try {
    const response = await fetch(
      `${process.env.MHPD_PENSIONS_DATA_URL}/pensions-data`,
      {
        method: 'GET',
        headers: {
          userSessionId: userSessionId,
          cookie: `userSessionId=${userSessionId}; authorizationCode=${authorizationCode};`,
        },
        signal: new AbortController().signal,
      },
    );

    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error('Failed to fetch pensions data');
    }

    const data: PensionData = await response.json();

    // If the data is not found, throw an error
    if (!data) {
      throw new Error('Pensions data not found');
    }

    // Transform the pension data
    data.pensionPolicies.forEach((policy) => {
      policy.pensionArrangements.forEach((pension) =>
        transformPensionData(pension),
      );
    });

    return data;
  } catch (error) {
    console.error('Error fetching pensions data:', error);
    throw error;
  }
};
