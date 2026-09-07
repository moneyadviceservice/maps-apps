import { GetServerSidePropsContext } from 'next';

import { getIronSession } from 'iron-session';
import type { IronSessionData } from 'iron-session';

import { accountSessionOptions } from './accountSessionOptions';

export async function getAccountSession(context: GetServerSidePropsContext) {
  const session = await getIronSession<IronSessionData>(
    context.req,
    context.res,
    accountSessionOptions,
  );

  if (!session?.isAccountAuthenticated) return null;
  return session;
}
