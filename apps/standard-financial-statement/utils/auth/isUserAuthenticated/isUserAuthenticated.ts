import { IronSessionData } from 'iron-session';

export const isUserAuthenticated = (session: IronSessionData) =>
  !!(session?.isAuthenticated && session?.account?.homeAccountId);
