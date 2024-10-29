import {
  AuthenticationResult,
  PublicClientApplication,
} from '@azure/msal-node';

const msalConfig = {
  auth: {
    clientId: process.env.ENTRA_CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${process.env.ENTRA_TENANT}`,
  },
  scopes: ['user.read'],
};

const pca = new PublicClientApplication(msalConfig);
const msalTokenCache = pca.getTokenCache();

export async function verifyCredentials(credentials: {
  username: string;
  password: string;
}): Promise<AuthenticationResult | null> {
  const usernamePasswordRequest = {
    scopes: ['user.read'],
    username: credentials.username,
    password: credentials.password,
  };

  return pca.acquireTokenByUsernamePassword(usernamePasswordRequest);
}

export async function refreshToken(): Promise<AuthenticationResult | null> {
  async function getAccounts() {
    return await msalTokenCache.getAllAccounts();
  }

  const accounts = await getAccounts();

  // Acquire Token Silently if an account is present
  if (accounts.length > 0) {
    const silentRequest = {
      account: accounts[0], // Index must match the account that is trying to acquire token silently
      scopes: ['user.read'],
    };

    return pca.acquireTokenSilent(silentRequest);
  }

  return null;
}
