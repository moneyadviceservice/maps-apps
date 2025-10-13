import { IronSession, IronSessionData } from 'iron-session';

import { redisDel } from '@maps-react/redis/helpers';

export const destroySession = async (
  session: IronSession<IronSessionData>,
  sessionKey: string,
): Promise<boolean> => {
  session.destroy();

  await redisDel(sessionKey);

  return true;
};
