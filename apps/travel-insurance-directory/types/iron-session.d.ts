import { IronSession, IronSessionData } from 'iron-session';
import type {
  AccountInfo,
  AuthorizationCodeRequest,
  AuthorizationUrlRequest,
} from '@azure/msal-node';

import { CreateUserObject, FcaObject } from './register';

declare module 'iron-session' {
  interface IronSessionData {
    fcaData?: FcaObject;
    userData?: CreateUserObject;
    firm?: Record<string, string>;
    // Admin auth (Entra/MSAL)
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
    db_id?: string;
    // Used to store registration progress link
    savedProgressLink?: string;
  }
}

declare module 'next' {
  interface NextApiRequest {
    session: IronSessionData;
  }
}

export type IronSessionObject = IronSession & MySessionData;
