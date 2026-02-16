import { GetServerSidePropsContext } from 'next';

import { deleteStoreEntry } from '.';

/**
 * Deletes the store entry for the session and clears the session cookie.
 * Safe to call in SSR/API routes. Logs and swallows errors.
 * @param context
 */
export async function cleanupSession(context: GetServerSidePropsContext) {
  try {
    await deleteStoreEntry(context);
  } catch (error) {
    console.warn('Error deleting store entry during cleanup:', error);
  }
  context.res.setHeader(
    'Set-Cookie',
    'fsid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
  );
}
