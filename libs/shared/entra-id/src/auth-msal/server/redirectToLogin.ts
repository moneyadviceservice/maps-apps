import { GetServerSidePropsContext } from 'next';

import type { RedirectOrSession } from '../types';

export function redirectToLogin(
  context: GetServerSidePropsContext,
): RedirectOrSession {
  const returnTo = context.resolvedUrl ?? '/';
  return {
    redirect: {
      destination: `/api/auth/signin?redirectTo=${encodeURIComponent(
        returnTo,
      )}`,
      permanent: false,
    },
  };
}
