import { IronSession, IronSessionData } from 'iron-session';

declare module 'iron-session' {
  interface IronSessionData {
    fcaData?: {
      firmName?: string;
      frnNumber?: string;
    };
  }
}

declare module 'next' {
  interface NextApiRequest {
    session: IronSessionData;
  }
}

export type IronSessionObject = IronSession & MySessionData;
