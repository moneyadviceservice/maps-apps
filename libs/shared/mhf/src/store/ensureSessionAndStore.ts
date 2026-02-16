import { type IncomingMessage } from 'node:http';
import { v4 as uuidv4 } from 'uuid';

import { setStoreEntry } from '../store/';
import { RouteFlow } from '../types';

/**
 * Initialise a session and store entry exists, creating a new session ID if necessary. It is shared between the autoAdvanceGuard and form-handler.
 * @param req - The request object, which can be a Request or IncomingMessage.
 * @param flow - The flow name to use if a new session is created. Defaults to 'money-management'.
 * @param routeFlow - A map of flow names to their corresponding steps. Used to set the steps in the store entry when creating a new session.
 * @param stepIndex - The initial step index for the flow. Defaults to 0. Only passed in when autoAdvanceGuard is called.
 * @param forceNewSession - If true, forces the creation of a new session even if one already exists. A hard reset of the session used when autoAdvanceGuard is called. This is to ensure the autoAdvance stepIndex is in the flow which is also passed in.
 * @param lang - The language code to set in the session data. Defaults to 'en'.
 * @returns key, responseHeaders
 */
export async function ensureSessionAndStore(
  req: Request | IncomingMessage,
  flow: string,
  routeFlow: RouteFlow,
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
    const flowConfig = routeFlow.get(flow);

    if (!flowConfig) {
      throw new Error(
        `[ensureSessionAndStore] No flow configuration found for flow: ${flow}`,
      );
    }

    // Destructure steps flowConfig
    const { steps } = flowConfig;

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
      steps,
      stepIndex,
      errors: {},
    });
  }
  return { key, responseHeaders };
}
