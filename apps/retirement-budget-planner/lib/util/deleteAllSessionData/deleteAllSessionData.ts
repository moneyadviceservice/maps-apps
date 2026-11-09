import { ERROR_TYPES } from 'lib/constants/constants';
import { allPageNamesArray } from 'lib/constants/pageConstants';

import { redisRestDel } from '@maps-react/redis/rest-client';

/**
 * deleteAllSessionData
 *
 * Construct an array of all Redis keys to delete for the supplied session ID –
 * one key for each page name. Then use that to make a single call to redisDel,
 * rather than separate calls for each key.
 */
export const deleteAllSessionData = async (sessionId: string) => {
  if (!sessionId) {
    throw new Error('sessionId is required');
  }

  if (typeof sessionId !== 'string') {
    throw new TypeError('sessionId must be a string');
  }

  const allPageNameSessionRedisKeys = allPageNamesArray
    .filter((pageName) => !['landing'].includes(pageName)) // Exclude landing page as it will never have any stored session data
    .map((pageName) => `${pageName}:${sessionId}`);

  try {
    const deleteAllSessionDataResponse = await Promise.allSettled(
      allPageNameSessionRedisKeys.map((key) => redisRestDel(key)),
    );

    const failedResponses = deleteAllSessionDataResponse
      .filter(
        (response) => response.status === 'rejected' || !response.value.success,
      )
      .map((response) =>
        response.status === 'rejected'
          ? String(response.reason)
          : response.value.error || 'Unknown error',
      );

    if (failedResponses.length > 0) {
      throw new Error(failedResponses.join(', '));
    }

    return deleteAllSessionDataResponse;
  } catch (error) {
    console.error('Error deleting session data from Redis:', error);

    throw new Error('Error deleting session data from Redis', {
      cause: {
        type: ERROR_TYPES.API_CALL_FAILED,
        error,
      },
    });
  }
};
