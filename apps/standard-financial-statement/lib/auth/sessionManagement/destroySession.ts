import { IronSession, IronSessionData } from 'iron-session';
import { Store } from '@netlify/blobs';

export const destroySession = async (
  session: IronSession<IronSessionData>,
  sessionKey: string,
  store: Store,
): Promise<boolean> => {
  session.destroy();

  await store.delete(sessionKey);

  return true;
};
