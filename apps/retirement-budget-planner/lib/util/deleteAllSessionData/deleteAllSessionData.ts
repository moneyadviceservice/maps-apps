import { ERROR_TYPES } from 'lib/constants/constants';
import { allPageNamesArray } from 'lib/constants/pageConstants';

import { redisDel } from '@maps-react/redis/helpers';

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

  const allPageNameSessionRedisKeys = allPageNamesArray.map(
    (pageName) => `${pageName}:${sessionId}`,
  );

  try {
    const deleteAllSessionDataResponse = await redisDel(
      allPageNameSessionRedisKeys,
    );

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
