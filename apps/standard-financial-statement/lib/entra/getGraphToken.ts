import { msalConfig } from 'lib/auth/config';
import { ConfidentialClientApplication } from '@azure/msal-node';

const getMsalInstance = () => new ConfidentialClientApplication(msalConfig);

export async function getGraphToken(): Promise<string | Error> {
  try {
    const msalInstance = getMsalInstance();

    const result = await msalInstance.acquireTokenByClientCredential({
      scopes: ['https://graph.microsoft.com/.default'],
    });

    if (!result?.accessToken) {
      throw new Error('Failed to acquire access token');
    }

    return result.accessToken;
  } catch (error) {
    console.error('Error: ', error);

    return new Error('Error feetching graph token');
  }
}
