import { http, HttpResponse } from 'msw';

const ENTRA_URL = process.env.ENTRA_CLIENT_URL ?? 'https://mock-entra.com';

export const entraHandlers = [
  // 1. START ENDPOINT
  http.post(
    `${ENTRA_URL}/signup/v1.0/start`,
    async ({ request }: { request: Request }) => {
      const text = await request.text();
      const params = new URLSearchParams(text);
      const username = params.get('username');

      // Trigger specific error for E2E testing
      if (username === 'exists@example.com') {
        return HttpResponse.json(
          { error: 'email_exists', error_description: 'email_exists' },
          { status: 400 },
        );
      }

      return HttpResponse.json({ continuation_token: 'mock_start_token_123' });
    },
  ),

  // 2. CHALLENGE ENDPOINT
  http.post(`${ENTRA_URL}/signup/v1.0/challenge`, async () => {
    return HttpResponse.json({
      continuation_token: 'mock_challenge_token_456',
    });
  }),

  // 3. CONTINUE (OTP) ENDPOINT
  http.post(
    `${ENTRA_URL}/signup/v1.0/continue`,
    async ({ request }: { request: Request }) => {
      const text = await request.text();
      const params = new URLSearchParams(text);
      const otp = params.get('oob');

      // Trigger specific errors based on the OTP value entered in Playwright
      if (otp === '000000') {
        return HttpResponse.json(
          { error: 'expired_token', error_description: 'The OTP has expired' },
          { status: 400 },
        );
      }

      if (otp === '111111') {
        return HttpResponse.json(
          { error: 'invalid_grant', error_description: 'The OTP is incorrect' },
          { status: 400 },
        );
      }

      // Success
      return HttpResponse.json({
        continuation_token: 'mock_continue_token_789',
      });
    },
  ),

  // Native sign-in (account login) — startSignIn / getSignInChallenge
  http.post(
    `${ENTRA_URL}/oauth2/v2.0/initiate`,
    async ({ request }: { request: Request }) => {
      const text = await request.text();
      const params = new URLSearchParams(text);
      const username = params.get('username');

      if (username === 'unknown-user-e2e@maps.test') {
        return HttpResponse.json(
          {
            error: 'invalid_grant',
            error_description: 'User not found',
          },
          { status: 400 },
        );
      }

      return HttpResponse.json({
        continuation_token: 'mock_signin_init_token',
      });
    },
  ),

  http.post(`${ENTRA_URL}/oauth2/v2.0/challenge`, async () => {
    return HttpResponse.json({
      continuation_token: 'mock_signin_challenge_token',
    });
  }),

  // 4. TOKEN ENDPOINT (sign-in OTP, continuation_token grant, etc.)
  http.post(`${ENTRA_URL}/oauth2/v2.0/token`, async ({ request }) => {
    const text = await request.text();
    const params = new URLSearchParams(text);
    const grantType = params.get('grant_type');
    const oob = params.get('oob');

    // Account sign-in: `submitSignInOtp` uses grant_type=oob — reject a fixed code for e2e
    if (grantType === 'oob' && oob === '111111') {
      return HttpResponse.json(
        {
          error: 'invalid_grant',
          error_description: 'The OTP is incorrect',
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      access_token: 'mock_access_token',
      id_token: 'mock_jwt_id_token',
      token_type: 'Bearer',
      expires_in: 3600,
    });
  }),
];
