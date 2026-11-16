import { decryptSessionId, encryptSessionId } from 'utils/sessionToken';
import { v4 as uuidv4 } from 'uuid';

import { cosmosGetSession } from '@maps-react/cosmos/rest-client';

const CONNECTED_STATUS = 404;

export const cosmosConnection = async () => {
  try {
    const publicSessionId = encryptSessionId(uuidv4().replaceAll('-', ''));
    const result = await cosmosGetSession(decryptSessionId(publicSessionId));

    if (result.status === CONNECTED_STATUS) {
      return true;
    }

    console.error(
      '[Cosmos] connection check failed',
      result.status,
      result.error,
    );
    return false;
  } catch (error) {
    console.error('[Cosmos] connection check failed', error);
    return false;
  }
};
