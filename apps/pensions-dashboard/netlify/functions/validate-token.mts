import { validateBetaAccessToken } from '../../lib/api/beta-access-control-service';

/**
 * Netlify function to validate an access token for secure beta access.
 *
 * @param request - Request object containing JSON body with token
 * @returns Response with status:
 *   - 200: Token is valid
 *   - 401: Token is invalid
 *   - 500: Missing environment variable or external service unavailable
 */
export default async function handler(request: Request) {
  const { token } = await request.json();

  // Internal server error if environment variable is not set
  if (!process.env.MHPD_BETA_ACCESS_SERVICE) {
    console.error(
      'Token validation failed: missing MHPD_BETA_ACCESS_SERVICE environment variable',
    );
    return new Response(null, { status: 500 });
  }

  const result = await validateBetaAccessToken(token ?? '');

  if (result === 'valid') {
    return new Response(null, { status: 200 });
  }

  if (result === 'invalid') {
    console.error('Token validation failed: invalid token');
    return new Response(null, { status: 401 });
  }

  console.error('Token validation failed: external service unavailable');
  return new Response(null, { status: 500 });
}
