import { Configuration, LogLevel } from '@azure/msal-node';

export const TENANT_SUBDOMAIN = process.env.TENANT_SUBDOMAIN;
export const REDIRECT_URI = process.env.REDIRECT_URI;
export const CLIENT_ID = process.env.ENTRA_CLIENT_ID ?? '';

export const ADMIN_APP_ROLE = process.env.ADMIN_APP_ROLE ?? 'tid_admin';

export const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID,
    authority: `https://${TENANT_SUBDOMAIN}.ciamlogin.com/`,
    clientSecret: process.env.ENTRA_CLIENT_SECRET,
  },
  system: {
    loggerOptions: {
      loggerCallback(
        logLevel: LogLevel,
        message: string,
        containsPii: boolean,
      ) {
        if (process.env.NODE_ENV === 'production' && containsPii) {
          return;
        }
        console.log(`[MSAL][${LogLevel[logLevel]}] ${message}`);
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Info,
    },
  },
};
