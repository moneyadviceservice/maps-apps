import { IronSession } from 'iron-session';
import { AccountInfo, ConfidentialClientApplication } from '@azure/msal-node';
import type { NextApiRequest } from 'next';

import type { SessionContextResult } from './session/loadSessionContext';

/** Request type for API route handlers wrapped by withSession. Use for the first argument of the handler. */
export type NextApiRequestWithSession = NextApiRequest & {
  session: IronSession<MsalSessionData>;
};

/** Session data shape for MSAL auth flow. User may or may not have admin role (`isAdmin`). */
export type MsalSessionData = {
  sessionKey?: string;
  expiresOn?: Date;
  isAuthenticated?: boolean;
  isAdmin?: boolean;
  username?: string;
  name?: string;
};

export type Redirect = {
  redirect: { destination: string; permanent: boolean };
};

export type RedirectOrSession = IronSession<MsalSessionData> | Redirect;

export type GetAdminSessionOptions = {
  getMsalInstance: () => ConfidentialClientApplication;
  loadSessionContext: (
    context: import('next').GetServerSidePropsContext,
  ) => Promise<SessionContextResult | null>;
  redirectToLogin: (
    context: import('next').GetServerSidePropsContext,
  ) => RedirectOrSession;
  destroySession: (
    session: IronSession<MsalSessionData>,
    sessionKey: string,
  ) => Promise<boolean>;
  hydrateMsal: (
    msalInstance: ConfidentialClientApplication,
    parsed: { tokenCache: string; account: AccountInfo | null },
  ) => Promise<AccountInfo | null>;
  handleSessionRefresh: (
    session: IronSession<MsalSessionData>,
    sessionKey: string,
    parsed: { tokenCache: string; account: AccountInfo | null },
    msalInstance: ConfidentialClientApplication,
    account: AccountInfo,
  ) => Promise<boolean>;
  requireAdmin?: boolean;
  adminRedirectPath?: string;
};

export type GetUserSessionOptions = Omit<
  GetAdminSessionOptions,
  'redirectToLogin' | 'requireAdmin' | 'adminRedirectPath'
>;
