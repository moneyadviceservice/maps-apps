import { IronSessionData } from 'iron-session';

export const isUserAdmin = (session: IronSessionData) =>
  !!session?.account?.idTokenClaims?.roles?.includes('sfs_admin');
