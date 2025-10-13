import type { IncomingMessage } from 'http';
import { v4 as uuidv4 } from 'uuid';

import { setStoreEntry } from '../../store/';
import { FlowName } from '../constants';

/**
 * Initialise a session and store entry exists, creating a new session ID if necessary. It is shared between the autoAdvanceGuard and form-handler.
 * @param req - The request object, which can be a Request or IncomingMessage.
 * @param flow - The flow name to use if a new session is created. Defaults to 'money-management'.
 * @param stepIndex - The initial step index for the flow. Defaults to 0. Only passed in when autoAdvanceGuard is called.
 * @param forceNewSession - If true, forces the creation of a new session even if one already exists. A hard reset of the session used when autoAdnavanceGuard is called. This is to ensure the autoAdvance stepIndex is in the flow which is also passed in.
 * @param lang - The language code to set in the session data. Defaults to 'en'.
 * @returns key, responseHeaders
 */
export async function ensureSessionAndStore(
  req: Request | IncomingMessage,
  flow: string | undefined = FlowName.DEFAULT,
  stepIndex = 0,
  forceNewSession = false,
  lang = 'en',
): Promise<{ key: string; responseHeaders: Headers }> {
  let cookieHeader = '';

  // Determine the cookie header based on the type of request
  if ('headers' in req && typeof (req as Request).headers.get === 'function') {
    // Fetch API Request
    cookieHeader = (req as Request).headers.get('cookie') ?? '';
  } else if (
    'headers' in req &&
    typeof (req as IncomingMessage).headers === 'object'
  ) {
    // Node.js IncomingMessage
    cookieHeader = (req as IncomingMessage).headers['cookie'] ?? '';
  }

  const responseHeaders = new Headers();
  let key = /(?:^|;\s*)fsid=([^;]*)/.exec(cookieHeader)?.[1] ?? null;

  // If no session ID is found, create a new one
  if (!key || forceNewSession) {
    key = uuidv4();
    responseHeaders.append(
      'Set-Cookie',
      `fsid=${key}; Path=/; HttpOnly; Secure; SameSite=Lax;`,
    );
    await setStoreEntry(key, {
      data: {
        flow,
        lang,
      },
      stepIndex,
      errors: {},
    });
  }
  return { key, responseHeaders };
}
