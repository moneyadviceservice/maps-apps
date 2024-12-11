export async function verifyCredentials(credentials: {
  username: string;
  password: string;
}) {
  const signInInitiateResponse = await signInInitiate(credentials.username);

  // init failed no continuation_token , throw error
  if (signInInitiateResponse.error) {
    throw signInInitiateResponse;
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

    if (token.error) {
      throw token;
    }

    return token;
  }
}

export const signInInitiate = async (username: string) => {
  const urlParams = new URLSearchParams();
  urlParams.append('client_id', process.env.ENTRA_CLIENT_ID as string);
  urlParams.append('username', username);
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
  urlParams.append('username', username);
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
  urlParams.append('username', username);
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
