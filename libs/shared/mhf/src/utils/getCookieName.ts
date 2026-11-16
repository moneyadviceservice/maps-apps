/**
 * Retrieves the name of the cookie used for session management.
 * Throws an error if the COOKIE_NAME environment variable is not set.
 */
export function getCookieName(): string {
  const cookieName = process.env.COOKIE_NAME;
  if (!cookieName) {
    throw new Error('COOKIE_NAME environment variable is required');
  }
  return cookieName;
}
