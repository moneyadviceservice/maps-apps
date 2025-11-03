import {
  DATA_NOT_FOUND,
  PensionsCategory,
  PensionsRetrievalStatus,
  PensionType,
} from '../constants';
import { GetPensionDataType, PensionArrangement } from '../types';
import { getPensionGroup, transformPensionData } from '../utils/data';
import { isSessionExpired } from '../utils/system/session';
import {
  serviceDeleteRequest,
  serviceGetRequest,
  servicePostRequest,
} from './shared';

export type PensionsStatus = {
  predictedTotalDataRetrievalTime: number;
  predictedRemainingDataRetrievalTime: number;
  pensionsDataRetrievalComplete: boolean;
};

export type PensionsSummaryArrangement = {
  pei: string;
  schemeName: string;
  category: PensionsCategory;
  retrievalStatus: PensionsRetrievalStatus;
  pensionType: PensionType;
  hasIncome: boolean;
  administratorName: string;
};

export type PensionsSummary = {
  isPensionRetrievalComplete: boolean;
  totalPensionsFound: number;
  pensions: PensionsSummaryArrangement[];
};

export type PensionsByCategory = {
  totalContactPensions: number;
  isPensionRetrievalComplete: boolean;
  arrangements: PensionArrangement[];
};

type DeletePensionDataType = {
  userSessionId: string;
};

type PostPensionsDataType = {
  userSessionId: string;
  authorizationCode: string;
  codeVerifier: string;
  redirectUrl: string;
  clientId: string;
  clientSecret: string;
};

type PostPensionsDataRetrievalType = {
  userSessionId: string;
  ticket: string;
};

/**
 * Deletes pension data for a user session.
 *
 * @param {DeletePensionDataType} params - The parameters for the request
 * @param {string} params.userSessionId - The user session identifier
 *
 * @returns {Promise<void>} Promise that resolves when deletion is complete
 *
 * @throws {Error} When response status is 5XX (server errors)
 * @throws {Error} When the fetch request fails
 */
export const deletePensionData = async ({
  userSessionId,
}: DeletePensionDataType): Promise<void> => {
  await serviceDeleteRequest({
    serviceUrl: `${process.env.MHPD_PENSION_DATA_SERVICE}`,
    endpoint: '/pensions-data',
    userSessionId,
  });
};

/**
 * Retrieves detailed pension information by ID.
 *
 * @param {string} id - The pension arrangement identifier
 * @param {GetPensionDataType} params - The user session parameters
 * @param {Object} params.userSession - The user session object
 * @param {string} params.userSession.userSessionId - The user session identifier
 * @param {string} [params.userSession.sessionStart] - The session start time
 *
 * @returns {Promise<PensionArrangement>} Promise that resolves to pension arrangement details
 */
export const getPensionDetailById = async (
  id: string,
  { userSession: { userSessionId, sessionStart } }: GetPensionDataType,
): Promise<PensionArrangement> => {
  const data = await serviceGetRequest<PensionArrangement[]>({
    serviceUrl: `${process.env.MHPD_PENSION_DATA_SERVICE}`,
    endpoint: `/pension-detail/${id}`,
    userSessionId,
    sessionStart,
    isSessionExpired,
  });

  // Additional validation for empty array
  if (data.length === 0) {
    throw new Error(DATA_NOT_FOUND);
  }

  const pension = data[0];

  return transformPensionData({
    ...pension,
    ...(pension.pensionCategory && { group: getPensionGroup(pension) }),
  });
};

/**
 * Retrieves pensions by category.
 *
 * @param {PensionsCategory} category - The pension category to retrieve
 * @param {GetPensionDataType} params - The user session parameters
 * @param {Object} params.userSession - The user session object
 * @param {string} params.userSession.userSessionId - The user session identifier
 * @param {string} [params.userSession.sessionStart] - The session start time
 *
 * @returns {Promise<PensionsByCategory | null>} Promise that resolves to pensions by category or null if retrieval is incomplete
 */
export const getPensionsByCategory = async (
  category: PensionsCategory,
  { userSession: { userSessionId, sessionStart } }: GetPensionDataType,
): Promise<PensionsByCategory | null> => {
  const data = await serviceGetRequest<PensionsByCategory>({
    serviceUrl: `${process.env.MHPD_PENSION_DATA_SERVICE}`,
    endpoint: `/pensions/${category}`,
    userSessionId,
    sessionStart,
    isSessionExpired,
  });

  // Return null if pension retrieval is not complete
  if (!data.isPensionRetrievalComplete) {
    return null;
  }

  const pensions = data.arrangements.flat();

  const arrangements = pensions.map((pension) => {
    return transformPensionData({
      ...pension,
      ...(pension.pensionCategory && { group: getPensionGroup(pension) }),
    });
  });

  return { ...data, arrangements };
};

/**
 * Retrieves the status of pensions data retrieval.
 *
 * @param {GetPensionDataType} params - The user session parameters
 * @param {Object} params.userSession - The user session object
 * @param {string} params.userSession.userSessionId - The user session identifier
 * @param {string} [params.userSession.sessionStart] - The session start time
 *
 * @returns {Promise<PensionsStatus>} Promise that resolves to pensions status
 */
export const getPensionsStatus = async ({
  userSession: { userSessionId, sessionStart },
}: GetPensionDataType): Promise<PensionsStatus> => {
  const data = await serviceGetRequest<PensionsStatus>({
    serviceUrl: `${process.env.MHPD_PENSION_DATA_SERVICE}`,
    endpoint: '/pensions-status',
    userSessionId,
    sessionStart,
    isSessionExpired,
  });

  return data;
};

/**
 * Retrieves a summary of pensions data.
 *
 * @param {GetPensionDataType} params - The user session parameters
 * @param {Object} params.userSession - The user session object
 * @param {string} params.userSession.userSessionId - The user session identifier
 * @param {string} [params.userSession.sessionStart] - The session start time
 *
 * @returns {Promise<PensionsSummary | null>} Promise that resolves to pensions summary or null if retrieval is incomplete
 */
export const getPensionsSummary = async ({
  userSession: { userSessionId, sessionStart },
}: GetPensionDataType): Promise<PensionsSummary | null> => {
  const data = await serviceGetRequest<PensionsSummary>({
    serviceUrl: `${process.env.MHPD_PENSION_DATA_SERVICE}`,
    endpoint: '/pensions-summary',
    userSessionId,
    sessionStart,
    isSessionExpired,
  });

  // Return null if pension retrieval is not complete
  if (!data.isPensionRetrievalComplete) {
    return null;
  }

  return data;
};

/**
 * Posts pensions data for initial retrieval setup.
 *
 * @param {PostPensionsDataType} params - The parameters for the request
 * @param {string} params.userSessionId - The user session identifier
 * @param {string} params.authorizationCode - The authorization code
 * @param {string} params.codeVerifier - The code verifier for PKCE
 * @param {string} params.redirectUrl - The redirect URL
 * @param {string} params.clientId - The client identifier
 * @param {string} params.clientSecret - The client secret
 *
 * @returns {Promise<Response>} Promise that resolves to the fetch response
 *
 * @throws {Error} When ISS environment variable is not set
 * @throws {Error} When the response is not ok
 * @throws {Error} When the fetch request fails
 */
export const postPensionsData = async ({
  userSessionId,
  authorizationCode,
  codeVerifier,
  redirectUrl,
  clientId,
  clientSecret,
}: PostPensionsDataType) => {
  return await servicePostRequest<Response>({
    serviceUrl: `${process.env.MHPD_PENSION_DATA_SERVICE}`,
    endpoint: '/pensions-data',
    userSessionId,
    body: {
      authorisationCode: authorizationCode,
      redirectUrl,
      codeVerifier,
      clientId,
      clientSecret,
    },
    expectedStatus: 'ok',
    returnResponse: true,
  });
};

/**
 * Posts pensions data retrieval request with ticket.
 *
 * @param {PostPensionsDataRetrievalType} params - The parameters for the request
 * @param {string} params.userSessionId - The user session identifier
 * @param {string} params.ticket - The retrieval ticket
 *
 * @returns {Promise<Response>} Promise that resolves to the fetch response
 *
 * @throws {Error} When ISS environment variable is not set
 * @throws {Error} When response status is not 202 (Accepted)
 * @throws {Error} When the fetch request fails
 */
export const postPensionsDataRetrieval = async ({
  userSessionId,
  ticket,
}: PostPensionsDataRetrievalType) => {
  return await servicePostRequest<Response>({
    serviceUrl: `${process.env.MHPD_PENSION_DATA_SERVICE}`,
    endpoint: '/pensions-data-retrieval',
    userSessionId,
    body: {
      ticket,
      clientId: process.env.MHPD_CLIENT_ID,
    },
    expectedStatus: 'accepted',
    returnResponse: true,
  });
};
