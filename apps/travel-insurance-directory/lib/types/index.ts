import { IronSession, IronSessionData } from 'iron-session';

type Redirect = {
  redirect: { destination: string; permanent: boolean };
};

export type RedirectOrSession = IronSession<IronSessionData> | Redirect;
