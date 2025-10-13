import {
  DATA_NOT_FOUND,
  REQUEST_ABANDONED,
  REQUEST_FAILED,
  RESPONSE_NOT_OK,
} from '../constants';
import { ClaimsGatheringResponseType } from '../types';

type GetClaimsGatheringType = {
  userSessionId: string;
};

export const getClaimsGatheringRedirect = async ({
  userSessionId,
}: GetClaimsGatheringType): Promise<ClaimsGatheringResponseType> => {
  try {
    if (!process.env.MHPD_ISS) {
      throw new Error(
        `${REQUEST_ABANDONED}: ISS environment variable is not set`,
      );
    }

    const response = await fetch(
      `${process.env.MHPD_MAPS_CDA_SERVICE}/claims-gathering-redirect`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          userSessionId: userSessionId,
          iss: process.env.MHPD_ISS,
          mhpdCorrelationId: userSessionId,
        },
      },
    );

    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(RESPONSE_NOT_OK);
    }

    const data: ClaimsGatheringResponseType = await response.json();

    // If the data is not found, throw an error
    if (!data) {
      throw new Error(DATA_NOT_FOUND);
    }

    return data;
  } catch (error) {
    console.error(REQUEST_FAILED, error);
    throw error;
  }
};
