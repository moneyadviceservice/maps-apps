import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import {
  getIronSession,
  type IronSession,
  type IronSessionData,
} from 'iron-session';
import { accountSessionOptions } from 'lib/accountAuth/accountSessionOptions';

import {
  getRegistrationAccessRedirect,
  type RegistrationAccessRequirement,
} from './registrationAccessRules';

export type { RegistrationAccessRequirement } from './registrationAccessRules';
export { getRegistrationAccessRedirect } from './registrationAccessRules';

/** Reads the shared registration + account iron session from a GSSP context. */
export async function getRegisterSession(
  context: Pick<GetServerSidePropsContext, 'req' | 'res'>,
): Promise<IronSession<IronSessionData>> {
  return getIronSession<IronSessionData>(
    context.req,
    context.res,
    accountSessionOptions,
  );
}

type AccessCheckResult =
  | { allowed: false; result: GetServerSidePropsResult<never> }
  | { allowed: true; session: IronSession<IronSessionData> };

/**
 * GSSP guard for registration pages. Call at the top of getServerSideProps;
 * return `access.result` when `allowed` is false, otherwise use `access.session`.
 */
export async function requireRegistrationAccess(
  context: Pick<GetServerSidePropsContext, 'req' | 'res'>,
  requirement: RegistrationAccessRequirement,
): Promise<AccessCheckResult> {
  const session = await getRegisterSession(context);
  const destination = getRegistrationAccessRedirect(session, requirement);

  if (destination) {
    return {
      allowed: false,
      result: {
        redirect: {
          destination,
          permanent: false,
        },
      },
    };
  }

  return { allowed: true, session };
}
