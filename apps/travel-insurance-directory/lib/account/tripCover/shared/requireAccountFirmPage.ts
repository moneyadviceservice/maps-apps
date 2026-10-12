import type { GetServerSidePropsContext } from 'next';

import { getAccountSession } from 'lib/accountAuth/getAccountSession';
import type { IronSessionObject } from 'types/iron-session';

import {
  resolveAccountFirmById,
  type ResolvedAccountFirm,
} from './resolveAccountFirmById';

export type FirmIdSource =
  | { from: 'params'; key: string }
  | { from: 'query'; key: string; optional?: boolean };

export type LoadAccountFirmResult =
  | {
      type: 'ok';
      session: IronSessionObject;
      firmId: string | null;
      resolved: ResolvedAccountFirm | null;
    }
  | {
      type: 'redirect';
      redirect: { destination: string; permanent: false };
    }
  | { type: 'notFound' };

export async function requireAccountSession(
  context: GetServerSidePropsContext,
) {
  const session = await getAccountSession(context);
  if (!session) {
    return {
      type: 'redirect' as const,
      redirect: {
        destination: '/account/login',
        permanent: false as const,
      },
    };
  }

  return { type: 'session' as const, session };
}

export function requireFirmIdParam(
  firmId: string | string[] | undefined,
): string | null {
  const raw = Array.isArray(firmId) ? firmId[0] : firmId;
  if (typeof raw !== 'string' || !raw.trim()) {
    return null;
  }

  return raw.trim();
}

function readRouteFirmId(
  context: GetServerSidePropsContext,
  key: string,
  source: FirmIdSource,
): string | null {
  if (source.from === 'query') {
    return requireFirmIdParam(context.query[key]);
  }

  const fromParams = requireFirmIdParam(context.params?.[key]);
  if (fromParams) {
    return fromParams;
  }

  return requireFirmIdParam(context.query[key]);
}

export async function requireAccountFirm(
  session: IronSessionObject,
  firmId: string,
) {
  const resolved = await resolveAccountFirmById(session, firmId);
  if (!resolved) {
    return { type: 'notFound' as const };
  }

  return { type: 'firm' as const, resolved };
}

export async function loadAccountFirmForPage(
  context: GetServerSidePropsContext,
  firmIdSource: FirmIdSource,
): Promise<LoadAccountFirmResult> {
  const sessionResult = await requireAccountSession(context);
  if (sessionResult.type === 'redirect') {
    return sessionResult;
  }

  const firmId = readRouteFirmId(context, firmIdSource.key, firmIdSource);
  if (!firmId) {
    if (firmIdSource.from === 'query' && firmIdSource.optional) {
      return {
        type: 'ok',
        session: sessionResult.session,
        firmId: null,
        resolved: null,
      };
    }

    return { type: 'notFound' };
  }

  const firmResult = await requireAccountFirm(sessionResult.session, firmId);
  if (firmResult.type === 'notFound') {
    return { type: 'notFound' };
  }

  return {
    type: 'ok',
    session: sessionResult.session,
    firmId,
    resolved: firmResult.resolved,
  };
}

export async function loadRequiredAccountFirmParams<T>(
  context: GetServerSidePropsContext,
  emptyProps: T,
) {
  const loadResult = await loadAccountFirmForPage(context, {
    from: 'params',
    key: 'firmId',
  });

  if (loadResult.type === 'redirect') {
    return {
      status: 'redirect' as const,
      redirect: loadResult.redirect,
      emptyProps,
    };
  }

  if (
    loadResult.type === 'notFound' ||
    !loadResult.firmId ||
    !loadResult.resolved
  ) {
    return { status: 'notFound' as const };
  }

  return {
    status: 'ok' as const,
    firmId: loadResult.firmId,
    resolved: loadResult.resolved,
  };
}

export function redirectToSelfServeStep(destination: string) {
  return {
    redirect: {
      destination,
      permanent: false as const,
    },
  };
}
