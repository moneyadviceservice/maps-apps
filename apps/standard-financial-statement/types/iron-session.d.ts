import { IronSessionData } from 'iron-session';
import { IronSession } from 'iron-session';
import type {
  AccountInfo,
  AuthorizationCodeRequest,
  AuthorizationUrlRequest,
} from '@azure/msal-node';

declare module 'iron-session' {
  interface IronSessionData {
    csrfToken?: string;
    authCodeRequest?: AuthorizationCodeRequest;
    authCodeUrlRequest?: AuthorizationUrlRequest;
    pkceCodes?: {
      verifier: string;
      challenge: string;
      challengeMethod: string;
    };
    idToken?: string;
    account?: AccountInfo;
    username?: string;
    name?: string;
    isAuthenticated?: boolean;
    isAdmin?: boolean;
    tokenCache?: string;
    expiresOn?: Date;
    sessionKey?: string;
  }
}

declare module 'next' {
  interface NextApiRequest {
    session: IronSessionData;
  }
}

export type IronSessionObject = IronSession & MySessionData;
