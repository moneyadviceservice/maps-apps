/**
 * Verifies user credentials by initiating a sign-in process, handling challenges, and obtaining a token.
 *
 * @param credentials - An object containing the username and password of the user.
 * @param credentials.username - The username of the user.
 * @param credentials.password - The password of the user.
 *
 * @returns A promise that resolves to the token if the sign-in process is successful, or an error response if it fails.
 */

export async function verifyCredentials(credentials: {
  username: string;
  password: string;
}) {
  const signInInitiateResponse = await signInInitiate(credentials.username);

  // init failed no continuation_token, return error
  if (signInInitiateResponse.error) {
    return signInInitiateResponse;
  }

  if (signInInitiateResponse.continuation_token) {
    const signInChallangeResponse = await signInChallange({
      username: credentials.username,
      token: signInInitiateResponse.continuation_token,
    });

    const token = await signInToken({
      username: credentials.username,
      password: credentials.password,
      token: signInChallangeResponse.continuation_token,
    });

    return token;
  }
}

export const signInInitiate = async (username: string) => {
  const urlParams = new URLSearchParams();
  urlParams.append('client_id', process.env.ENTRA_CLIENT_ID as string);
  urlParams.append('username', `${username}@MANREFERRAL.COM`);
  urlParams.append('challenge_type', 'password redirect');
  try {
    const response = await fetch(`${process.env.ENTRA_CLIENT_URL}/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: urlParams.toString(),
    });

    return response.json();
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

export const signInChallange = async ({
  username,
  token,
}: {
  username: string;
  token: string;
}) => {
  const urlParams = new URLSearchParams();
  urlParams.append('client_id', process.env.ENTRA_CLIENT_ID as string);
  urlParams.append('username', `${username}@MANREFERRAL.COM`);
  urlParams.append('challenge_type', 'password redirect');
  urlParams.append('continuation_token', token);

  try {
    const response = await fetch(`${process.env.ENTRA_CLIENT_URL}/challenge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: urlParams.toString(),
    });

    return response.json();
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

export const signInToken = async ({
  username,
  password,
  token,
}: {
  username: string;
  password: string;
  token: string;
}) => {
  const urlParams = new URLSearchParams();
  urlParams.append('client_id', process.env.ENTRA_CLIENT_ID as string);
  urlParams.append('username', `${username}@MANREFERRAL.COM`);
  urlParams.append('challenge_type', 'password redirect');
  urlParams.append('continuation_token', token);
  urlParams.append('password', password);
  urlParams.append('scope', 'openid offline_access');
  urlParams.append('grant_type', 'password');
  try {
    const response = await fetch(`${process.env.ENTRA_CLIENT_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: urlParams.toString(),
    });

    return response.json();
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

export const refreshAccessToken = async (refresh_token: string) => {
  const urlParams = new URLSearchParams();
  urlParams.append('client_id', process.env.ENTRA_CLIENT_ID as string);
  urlParams.append('grant_type', 'refresh_token');
  urlParams.append('refresh_token', refresh_token);
  try {
    const response = await fetch(`${process.env.ENTRA_CLIENT_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: urlParams.toString(),
    });

    return response.json();
  } catch (error) {
    console.error('error', error);
    throw new Error('error');
  }
};
