import { GetServerSidePropsContext } from 'next';

import { IronSession } from 'iron-session';

import type {
  GetAdminSessionOptions,
  MsalSessionData,
  RedirectOrSession,
} from '../types';
import { getAdminSession } from './getAdminSession';
import { getUserSession } from './getUserSession';

export type CreateSessionHelpersOptions = Omit<
  GetAdminSessionOptions,
  'requireAdmin' | 'adminRedirectPath'
> & { adminRedirectPath?: string };

export type SessionHelpers = {
  getAdminSession: (
    context: GetServerSidePropsContext,
    requireAdmin?: boolean,
  ) => Promise<RedirectOrSession>;
  getUserSession: (
    context: GetServerSidePropsContext,
  ) => Promise<IronSession<MsalSessionData> | null>;
  redirectToLogin: GetAdminSessionOptions['redirectToLogin'];
};

/**
 * Creates getAdminSession, getUserSession, and redirectToLogin bound to shared
 * options so apps can avoid duplicating session helper wiring.
 */
export function createSessionHelpers(
  options: CreateSessionHelpersOptions,
): SessionHelpers {
  const { adminRedirectPath = '/admin', ...rest } = options;
  return {
    getAdminSession(context, requireAdmin = false) {
      return getAdminSession(context, {
        ...rest,
        requireAdmin,
        adminRedirectPath,
      });
    },
    getUserSession(context) {
      return getUserSession(context, rest);
    },
    redirectToLogin: options.redirectToLogin,
  };
}
