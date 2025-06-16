import type { GetServerSidePropsContext } from 'next';

import { getIronSession, IronSessionData } from 'iron-session';
import { sessionOptions } from 'lib/auth/sessionOptions';

import { isUserAuthenticated } from '../isUserAuthenticated';
import { isUserAdmin } from 'utils/admin/isAdmin';

type AuthCheckResult =
  | { redirect: { destination: string; permanent: false } }
  | { session: IronSessionData };

export async function requireAdminAuthentication(
  context: GetServerSidePropsContext,
  redirectTo?: string,
): Promise<AuthCheckResult> {
  const { req, res, resolvedUrl } = context;

  const session = await getIronSession<IronSessionData>(
    req,
    res,
    sessionOptions,
  );

  if (!isUserAuthenticated(session)) {
    return {
      redirect: {
        destination: `/api/auth/signin?redirectTo=${encodeURIComponent(
          redirectTo ?? resolvedUrl,
        )}`,
        permanent: false,
      },
    };
  } else if (isUserAuthenticated(session) && !isUserAdmin(session)) {
    return {
      redirect: {
        destination: `/admin`,
        permanent: false,
      },
    };
  }

  return { session: session };
}
