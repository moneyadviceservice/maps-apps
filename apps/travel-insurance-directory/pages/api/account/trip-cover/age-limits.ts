import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { isCoverAndServiceConfirmed } from 'lib/account/firmSectionStatus';
import {
  buildDraftTripCoversPatch,
  mergeFirmWithSelfServeEditDraft,
} from 'lib/account/selfServeEditDraft';
import { resolveTripCoverPostSavePath } from 'lib/account/tripCover/confirm';
import {
  handleTripCoverApiError,
  persistFirmOrRespond,
  persistTripCoversOrRespond,
  requireFirmIdFromBody,
  resolveFirmOrRespond404,
} from 'lib/account/tripCover/shared/api';
import {
  ageLimitsPath,
  buildTripCoverSteps,
  findStepIndex,
  getNextStepPath,
  parseTripCoverStepParams,
  regionsPath,
  serviceDetailsPath,
} from 'lib/account/tripCover/steps';
import {
  getAgeLimitsErrorFallbackRoute,
  parseAgeLimitFields,
  updateTripCoverAgeLimits,
} from 'lib/account/tripCover/TripCoverAgeLimits';
import { withAccountSession } from 'lib/accountAuth/withAccountSession';
import { IronSessionObject } from 'types/iron-session';
import { errorFormat } from 'utils/api/errorFormat/errorFormat';
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

    const step = parseTripCoverStepParams(
      (req.body?.coverArea ?? '').toString(),
      (req.body?.tripType ?? '').toString(),
    );
    const fallbackRoute = regionsPath(firmId);

    if (!step) {
      return respond(req, res, {
        status: 400,
        data: errorFormat({ page: { error: 'general_error' } }),
        redirect: fallbackRoute,
      });
    }

    const currentRoute = ageLimitsPath(firmId, step.coverArea, step.tripType);

    const resolved = await resolveFirmOrRespond404(req, res, session, firmId);
    if (!resolved) {
      return;
    }

    const stageInDraft = isCoverAndServiceConfirmed(resolved.firm);
    const viewFirm = mergeFirmWithSelfServeEditDraft(resolved.firm);
    const tripCovers = viewFirm.trip_covers ?? [];
    const steps = buildTripCoverSteps(tripCovers);
    if (findStepIndex(steps, step.coverArea, step.tripType) < 0) {
      return respond(req, res, {
        status: 400,
        data: errorFormat({ page: { error: 'general_error' } }),
        redirect: fallbackRoute,
      });
    }

    const { ageLimits, fieldErrors } = parseAgeLimitFields(req.body);

    if (!ageLimits) {
      return respond(req, res, {
        status: 400,
        data: {
          error: true,
          fields: fieldErrors,
        },
        redirect: currentRoute,
      });
    }

    const syncedTripCovers = updateTripCoverAgeLimits(
      tripCovers,
      step,
      ageLimits,
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
      getNextStepPath(firmId, syncedTripCovers, step) ??
      serviceDetailsPath(firmId);
    const nextPath = resolveTripCoverPostSavePath(req, firmId, defaultNext);

    respond(req, res, {
      data: { success: true, nextPath },
      redirect: nextPath,
    });
  } catch (error) {
    const firmId = (req.body?.firmId ?? '').toString().trim();
    const fallbackRoute = firmId
      ? getAgeLimitsErrorFallbackRoute(firmId, req.body ?? {})
      : '/account';

    return handleTripCoverApiError(req, res, error, fallbackRoute);
  }
};

export default withAccountSession(handler);
