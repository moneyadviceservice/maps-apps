import { ClaimsGatheringResponseType, PostResponseType } from '../types';
import { serviceGetRequest, servicePostRequest } from './shared';

// Types
type GetClaimsGatheringType = {
  userSessionId: string;
};

type PostRedirectDetailsType = {
  userSessionId: string;
};

/**
 * Retrieves claims gathering redirect information from the MAPS CDA service.
 *
 * @param {GetClaimsGatheringType} params - The parameters for the request
 * @param {string} params.userSessionId - The user session identifier
 *
 * @returns {Promise<ClaimsGatheringResponseType>} Promise that resolves to claims gathering response data
 */
export const getClaimsGatheringRedirect = async ({
  userSessionId,
}: GetClaimsGatheringType): Promise<ClaimsGatheringResponseType> => {
  return serviceGetRequest<ClaimsGatheringResponseType>({
    serviceUrl: `${process.env.MHPD_MAPS_CDA_SERVICE}`,
    endpoint: '/claims-gathering-redirect',
    userSessionId,
    includeIss: true,
  });
};

/**
 * Posts redirect details to the MAPS CDA service for pension data retrieval.
 *
 * @param {PostRedirectDetailsType} params - The parameters for the request
 * @param {string} params.userSessionId - The user session identifier
 *
 * @returns {Promise<any>} Promise that resolves to the response data from the service
 *
 * @throws {Error} When ISS environment variable is not set
 * @throws {Error} When the response is not ok
 * @throws {Error} When the fetch request fails
 */
export const postRedirectDetails = async ({
  userSessionId,
}: PostRedirectDetailsType) => {
  return await servicePostRequest<PostResponseType>({
    serviceUrl: `${process.env.MHPD_MAPS_CDA_SERVICE}`,
    endpoint: '/redirect-details',
    userSessionId,
    body: {
      redirectPurpose: 'FIND',
    },
    expectedStatus: 'ok',
  });
};
