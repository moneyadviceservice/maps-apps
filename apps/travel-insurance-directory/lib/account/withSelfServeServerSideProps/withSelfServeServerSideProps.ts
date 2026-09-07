import { GetServerSideProps } from 'next';

import { IronSession, IronSessionData } from 'iron-session';
import { resolveAccountFirmById } from 'lib/account/tripCover/shared/resolveAccountFirmById';
import {
  getFirstIncompleteStepPath,
  getLastStepPath,
} from 'lib/account/tripCover/steps';
import { getAccountSession } from 'lib/accountAuth/getAccountSession';
import { getCookieAndCleanUp } from 'utils/helper/getCookieAndCleanUp';

import { areTripCoversComplete } from '../firmSectionStatus';

const extractFirmId = (
  queryParam: string | string[] | undefined,
): string | null => {
  return typeof queryParam === 'string' && queryParam.trim()
    ? queryParam.trim()
    : null;
};

const getInitialFirmValues = async (
  session: IronSession<IronSessionData>,
  firmId: string | null,
) => {
  const targetId = firmId ?? session.db_id;
  if (!targetId) return null;

  const resolved = await resolveAccountFirmById(session, targetId);
  return resolved?.firm ?? null;
};

type TripCoverStateResult =
  | { type: 'proceed'; backLink: string }
  | { type: 'notFound' }
  | { type: 'redirect'; destination: string };

const resolveTripCoverState = async (
  session: IronSession<IronSessionData>,
  firmId: string,
): Promise<TripCoverStateResult> => {
  const resolved = await resolveAccountFirmById(session, firmId);
  if (!resolved) {
    return { type: 'notFound' };
  }

  const tripCovers = resolved.firm.trip_covers ?? [];

  if (tripCovers.length > 0 && !areTripCoversComplete(tripCovers)) {
    const incompletePath = getFirstIncompleteStepPath(firmId, tripCovers);
    if (incompletePath) {
      return { type: 'redirect', destination: incompletePath };
    }
  }

  const backLink = getLastStepPath(firmId, tripCovers) ?? '/account';
  return { type: 'proceed', backLink };
};

export const withSelfServeServerSideProps: GetServerSideProps = async (
  context,
) => {
  const session = await getAccountSession(context);
  if (!session) {
    return {
      redirect: { destination: '/account/login', permanent: false },
      props: {},
    };
  }

  const firmId = extractFirmId(context.query.firmId);
  const isChangeAnswer = context.query.change ?? null;
  let backLink = '/account';

  const errorCookie = getCookieAndCleanUp(context, 'form_error', true);
  const initialValues = await getInitialFirmValues(session, firmId);

  if (firmId) {
    const tripCoverState = await resolveTripCoverState(session, firmId);

    if (tripCoverState.type === 'notFound') {
      return { notFound: true };
    }

    if (tripCoverState.type === 'redirect') {
      return {
        redirect: { destination: tripCoverState.destination, permanent: false },
      };
    }

    backLink = tripCoverState.backLink;
  }

  return {
    props: {
      initialErrors: errorCookie?.fields ?? {},
      initialValues,
      firmId,
      backLink,
      isChangeAnswer,
    },
  };
};
