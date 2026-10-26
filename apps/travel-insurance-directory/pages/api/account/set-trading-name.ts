import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import {
  ensurePostMethodAndAccountSession,
  loadPrincipalFirmForTradingMutation,
  respondAccountTradingNameError,
  respondTradingNameMutationSuccess,
} from 'lib/account/tradingNames/resolveAccountTradingNameRequest';
import {
  fetchTradingDocsByMainFirmId,
  upsertTradingFirm,
} from 'lib/account/tradingNames/tradingFirm';
import { withAccountSession } from 'lib/accountAuth/withAccountSession';
import type { IronSessionObject } from 'types/iron-session';
import { errorFormat } from 'utils/api/errorFormat';

function respondGeneralTradingNameError(
  req: NextApiRequest,
  res: NextApiResponse,
  status: number,
) {
  respondAccountTradingNameError(
    req,
    res,
    status,
    errorFormat({ page: { error: 'general_error' } }),
  );
}

const handler: NextApiHandler = async (
  req: NextApiRequest & { session: IronSessionObject },
  res: NextApiResponse,
) => {
  if (!ensurePostMethodAndAccountSession(req, res)) {
    return;
  }

  const name = (req.body?.name ?? '').toString().trim();
  if (!name) {
    respondAccountTradingNameError(
      req,
      res,
      400,
      errorFormat({ name: { error: 'required' } }),
    );
    return;
  }

  const ctx = await loadPrincipalFirmForTradingMutation(req, res, {
    requireMainFrnAsNumber: true,
  });
  if (!ctx) {
    return;
  }

  const mainFrn = ctx.mainFrn as number;

  const existing = await fetchTradingDocsByMainFirmId(ctx.firmId);
  if (!existing.success) {
    respondGeneralTradingNameError(req, res, 500);
    return;
  }
  if ((existing.response ?? []).length > 0) {
    respondGeneralTradingNameError(req, res, 409);
    return;
  }

  const result = await upsertTradingFirm({
    name,
    mainFrn,
    mainFirmId: ctx.firmId,
  });

  if (!result.success) {
    respondGeneralTradingNameError(req, res, 500);
    return;
  }

  respondTradingNameMutationSuccess(req, res);
};

export default withAccountSession(handler);

export const config = {
  api: {
    bodyParser: true,
  },
};
