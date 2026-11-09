import { IronSession } from 'iron-session';

import { redisRestDel } from '@maps-react/redis/rest-client';

import type { MsalSessionData } from '../types';

export async function destroySession(
  session: IronSession<MsalSessionData>,
  sessionKey: string,
): Promise<boolean> {
  session.destroy();

  const result = await redisRestDel(sessionKey);
  if (!result.success) {
    console.error('[destroySession] Redis del failed:', result.error);
  }

  return true;
}
