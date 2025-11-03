/**
 * @file Service for interacting with the Microsoft Entra ID Native Authentication API.
 * Encapsulates all fetch calls and parameter building for the sign-up flow.
 */

// A base fetch function to reduce repetition
async function fetchEntraApi(endpoint: string, body: URLSearchParams) {
  try {
    const response = await fetch(`${process.env.ENTRA_CLIENT_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: body.toString(),
    });
    return response.json();
  } catch (error) {
    console.error(`Entra API Error at ${endpoint}:`, error);
    throw new Error(`Failed to call Entra endpoint: ${endpoint}`);
  }
}

export const startSignUp = async (username: string) => {
  const params = new URLSearchParams({
    client_id: process.env.ENTRA_CLIENT_ID ?? '',
    challenge_type: 'oob password redirect',
    username,
  });
  const response = await fetchEntraApi('/signup/v1.0/start', params);
  return { success: !!response.continuation_token, ...response };
};

export const getChallenge = async (
  username: string,
  continuation_token: string,
) => {
  const params = new URLSearchParams({
    client_id: process.env.ENTRA_CLIENT_ID ?? '',
    challenge_type: 'oob password redirect',
    username,
    continuation_token,
  });
  const response = await fetchEntraApi('/signup/v1.0/challenge', params);
  return { success: !!response.continuation_token, ...response };
};

export const submitOtp = async (
  username: string,
  otp: string,
  continuation_token: string,
) => {
  const params = new URLSearchParams({
    client_id: process.env.ENTRA_CLIENT_ID ?? '',
    grant_type: 'oob',
    oob: otp,
    username,
    continuation_token,
  });
  const response = await fetchEntraApi('/signup/v1.0/continue', params);

  return { success: !!response.continuation_token, ...response };
};

export const submitAttributes = async (
  username: string,
  attributes: Record<string, unknown>,
  continuation_token: string,
) => {
  const params = new URLSearchParams({
    client_id: process.env.ENTRA_CLIENT_ID ?? '',
    grant_type: 'attributes',
    attributes: JSON.stringify(attributes),
    username,
    continuation_token,
  });
  const response = await fetchEntraApi('/signup/v1.0/continue', params);
  return { success: !!response.continuation_token, ...response };
};

export const submitPassword = async (
  username: string,
  password: string,
  continuation_token: string,
) => {
  const params = new URLSearchParams({
    client_id: process.env.ENTRA_CLIENT_ID ?? '',
    grant_type: 'password',
    password,
    username,
    continuation_token,
  });
  const response = await fetchEntraApi('/signup/v1.0/continue', params);
  return { success: !!response.continuation_token, ...response };
};

export const getToken = async (
  username: string,
  continuation_token: string,
) => {
  const params = new URLSearchParams({
    client_id: process.env.ENTRA_CLIENT_ID ?? '',
    grant_type: 'continuation_token',
    scope: 'openid offline_access',
    username,
    continuation_token,
  });
  return fetchEntraApi('/oauth2/v2.0/token', params);
};
