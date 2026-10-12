import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { isCoverAndServiceConfirmed } from 'lib/account/dashboard/firmSectionStatus';
import { buildDraftMedicalSpecialismsPatch } from 'lib/account/selfServeEditDraft';
import { resolveTripCoverPostSavePath } from 'lib/account/tripCover/confirm';
import {
  buildMedicalSpecialismPatchRecord,
  parseMedicalSpecialismFields,
} from 'lib/account/tripCover/medicalSpecialism';
import {
  handleTripCoverApiError,
  persistFirmOrRespond,
  requireFirmIdFromBody,
  resolveFirmOrRespond404,
} from 'lib/account/tripCover/shared/api';
import {
  medicalSpecialismPath,
  serviceDetailsPath,
} from 'lib/account/tripCover/steps';
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

    const currentRoute = medicalSpecialismPath(firmId);
    const { updatePath } = req.body;

    if (!updatePath) {
      return res.status(400).json({ error: 'updatePath is required' });
    }

    const { medicalSpecialisms, fieldErrors } = parseMedicalSpecialismFields(
      req.body,
    );

    if (!medicalSpecialisms) {
      respond(req, res, {
        status: 400,
        data: errorFormat(fieldErrors),
        redirect: currentRoute,
      });
      return;
    }

    const updateRecord = buildMedicalSpecialismPatchRecord(medicalSpecialisms);

    if (updateRecord) {
      const resolved = await resolveFirmOrRespond404(req, res, session, firmId);
      if (!resolved) {
        return;
      }

      const stageInDraft = isCoverAndServiceConfirmed(resolved.firm);
      const patch = stageInDraft
        ? buildDraftMedicalSpecialismsPatch(resolved.firm, updateRecord)
        : updateRecord;

      const saved = await persistFirmOrRespond(
        req,
        res,
        firmId,
        patch,
        currentRoute,
      );
      if (!saved) {
        return;
      }
    }

    const defaultNext = serviceDetailsPath(firmId);
    const nextPath = resolveTripCoverPostSavePath(req, firmId, defaultNext);

    respond(req, res, {
      data: { success: true, nextPath, data: session.firmData },
      redirect: nextPath,
    });
  } catch (error) {
    const firmId = (req.body?.firmId ?? '').toString().trim();
    return handleTripCoverApiError(
      req,
      res,
      error,
      firmId ? medicalSpecialismPath(firmId) : '/account',
    );
  }
};

export default withAccountSession(handler);
