import { Configuration, LogLevel } from '@azure/msal-node';

export const TENANT_SUBDOMAIN = process.env.TENANT_SUBDOMAIN;
export const REDIRECT_URI = process.env.REDIRECT_URI;
export const CLIENT_ID = process.env.ENTRA_CLIENT_ID_SIGN_IN ?? '';

export const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID,
    authority: `https://${TENANT_SUBDOMAIN}.ciamlogin.com/`,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET_SIGN_IN,
  },
  system: {
    loggerOptions: {
      loggerCallback(
        logLevel: LogLevel,
        message: string,
        containsPii: boolean,
      ) {
        if (process.env.NODE_ENV === 'production' && containsPii) {
          return; // don't log personal information
        }
        console.log(`[MSAL][${LogLevel[logLevel]}] ${message}`);
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Info,
    },
  },
};
