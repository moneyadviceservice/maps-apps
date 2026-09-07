import { type IncomingMessage } from 'node:http';
import { v4 as uuidv4 } from 'uuid';

import { getCookieName } from '../utils/getCookieName';
import { Language } from '../utils/language';
import { setStoreEntry } from './setStoreEntry';

/**
 * Initializes or resets a user session and store entry.
 * Creates a new session ID and store entry if none exists or if forceNewSession is true.
 * Sets the flow, language, initial step, and default step index in the store.
 * Returns the session key and response headers for cookie management.
 * @param req - Request or IncomingMessage object
 * @param initialStep - The step to start the session at
 * @param forceNewSession - If true, forces creation of a new session
 * @param flow - The flow name for the session
 * @param locale - The language code for the session
 * @returns Object containing session key and response headers
 */
export async function ensureSessionAndStore(
  req: Request | IncomingMessage,
  initialStep: string,
  forceNewSession = false,
  flow = '',
  locale: Language = 'en',
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
  const cookieName = getCookieName();
  let key =
    new RegExp(String.raw`(?:^|;\s*)${cookieName}=([^;]*)`).exec(
      cookieHeader,
    )?.[1] ?? null;

  if (!key || forceNewSession) {
    key = uuidv4();
    responseHeaders.append(
      'Set-Cookie',
      `${cookieName}=${key}; Path=/; HttpOnly; Secure; SameSite=Lax;`,
    );

    await setStoreEntry(key, {
      data: {
        flow,
        locale,
      },
      steps: [initialStep],
      stepIndex: 0,
      errors: {},
    });
  }

  return { key, responseHeaders };
}
