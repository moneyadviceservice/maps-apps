import type { NextApiRequest, NextApiResponse } from 'next';

import { updateFirm } from 'lib/firms/updateFirm';
import type { IronSessionObject } from 'types/iron-session';
import type { TripCover } from 'types/travel-insurance-firm';
import { errorFormat } from 'utils/api/errorFormat/errorFormat';
import { respond } from 'utils/api/respond/respond';

import { resolveAccountFirmById } from './resolveAccountFirmById';

export function requireFirmIdFromBody(
  req: NextApiRequest,
  res: NextApiResponse,
): string | null {
  const firmId = (req.body?.firmId ?? '').toString().trim();
  if (!firmId) {
    res.status(400).json({ error: 'firmId is required' });
    return null;
  }

  return firmId;
}

export async function resolveFirmOrRespond404(
  req: NextApiRequest,
  res: NextApiResponse,
  session: IronSessionObject,
  firmId: string,
) {
  const resolved = await resolveAccountFirmById(session, firmId);
  if (!resolved) {
    respond(req, res, {
      status: 404,
      data: errorFormat({ page: { error: 'general_error' } }),
      redirect: '/account',
    });
    return null;
  }

  return resolved;
}

export async function persistFirmOrRespond(
  req: NextApiRequest,
  res: NextApiResponse,
  firmId: string,
  patch: Record<string, unknown>,
  currentRoute: string,
): Promise<boolean> {
  const updateResult = await updateFirm(firmId, patch);

  if (!updateResult.success) {
    respond(req, res, {
      status: 500,
      data: errorFormat({ apiError: { error: 'general_error' } }),
      redirect: currentRoute,
    });
    return false;
  }

  return true;
}

export async function persistTripCoversOrRespond(
  req: NextApiRequest,
  res: NextApiResponse,
  firmId: string,
  tripCovers: TripCover[],
  currentRoute: string,
): Promise<boolean> {
  return persistFirmOrRespond(
    req,
    res,
    firmId,
    { trip_covers: tripCovers },
    currentRoute,
  );
}

export function handleTripCoverApiError(
  req: NextApiRequest,
  res: NextApiResponse,
  error: unknown,
  fallbackRoute: string,
) {
  console.error(error);
  return respond(req, res, {
    status: 500,
    data: errorFormat({ page: { error: 'general_error' } }),
    redirect: fallbackRoute,
  });
}
