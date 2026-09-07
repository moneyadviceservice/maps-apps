import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { TRIP_COVER_REGION_FIELD_NAME } from 'data/pages/account/tripCover/tripCoverConfig';
import { isCoverAndServiceConfirmed } from 'lib/account/firmSectionStatus';
import {
  buildDraftTripCoversPatch,
  mergeFirmWithSelfServeEditDraft,
} from 'lib/account/selfServeEditDraft';
import { resolveTripCoverPostSavePath } from 'lib/account/tripCover/confirm';
import { syncTripCoversForRegions } from 'lib/account/tripCover/RegionsCovered';
import {
  handleTripCoverApiError,
  persistFirmOrRespond,
  persistTripCoversOrRespond,
  requireFirmIdFromBody,
  resolveFirmOrRespond404,
} from 'lib/account/tripCover/shared/api';
import {
  getFirstStepPath,
  parseCoverAreas,
  regionsPath,
  serviceDetailsPath,
} from 'lib/account/tripCover/steps';
import { withAccountSession } from 'lib/accountAuth/withAccountSession';
import { IronSessionObject } from 'types/iron-session';
import { respond } from 'utils/api/respond/respond';

const handler: NextApiHandler = async (
  req: NextApiRequest & { session: IronSessionObject },
  res: NextApiResponse,
) => {
  if (req.method !== 'POST') return res.status(405).end();

  const session = req.session;

  try {
    const firmId = requireFirmIdFromBody(req, res);
    if (!firmId) {
      return;
    }

    const resolved = await resolveFirmOrRespond404(req, res, session, firmId);
    if (!resolved) {
      return;
    }

    const selectedAreas = parseCoverAreas(
      req.body?.[TRIP_COVER_REGION_FIELD_NAME],
    );
    const currentRoute = regionsPath(firmId);

    if (selectedAreas.length === 0) {
      return respond(req, res, {
        status: 400,
        data: {
          error: true,
          fields: { [TRIP_COVER_REGION_FIELD_NAME]: { error: 'required' } },
        },
        redirect: currentRoute,
      });
    }

    const stageInDraft = isCoverAndServiceConfirmed(resolved.firm);
    const viewFirm = mergeFirmWithSelfServeEditDraft(resolved.firm);
    const syncedTripCovers = syncTripCoversForRegions(
      viewFirm.trip_covers ?? [],
      selectedAreas,
    );

    const saved = stageInDraft
      ? await persistFirmOrRespond(
          req,
          res,
          firmId,
          buildDraftTripCoversPatch(resolved.firm, syncedTripCovers),
          currentRoute,
        )
      : await persistTripCoversOrRespond(
          req,
          res,
          firmId,
          syncedTripCovers,
          currentRoute,
        );
    if (!saved) {
      return;
    }

    const defaultNext =
      getFirstStepPath(firmId, syncedTripCovers) ?? serviceDetailsPath(firmId);
    const nextPath = resolveTripCoverPostSavePath(req, firmId, defaultNext);

    respond(req, res, {
      data: { success: true, nextPath },
      redirect: nextPath,
    });
  } catch (error) {
    const firmId = (req.body?.firmId ?? '').toString().trim();
    return handleTripCoverApiError(
      req,
      res,
      error,
      firmId ? regionsPath(firmId) : '/account',
    );
  }
};

export default withAccountSession(handler);
