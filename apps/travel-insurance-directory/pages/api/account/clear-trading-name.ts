import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import {
  ensurePostMethodAndAccountSession,
  loadPrincipalFirmForTradingMutation,
  respondAccountTradingNameError,
  respondTradingNameMutationSuccess,
} from 'lib/account/resolveAccountTradingNameRequest';
import { withAccountSession } from 'lib/accountAuth/withAccountSession';
import {
  deleteTradingFirmDocument,
  fetchTradingDocForMainById,
} from 'lib/account/tradingFirm';
import { hasFcaVisibilityBlock } from 'lib/firms/fcaVisibility';
import { errorFormat } from 'utils/api/errorFormat';
import { IronSessionObject } from 'types/iron-session';

function getTradingFirmIdFromRequest(req: NextApiRequest): string {
  const raw = req.body?.tradingFirmId ?? req.body?.tradingFirmID;
  return raw == null ? '' : String(raw).trim();
}

const handler: NextApiHandler = async (
  req: NextApiRequest & { session: IronSessionObject },
  res: NextApiResponse,
) => {
  if (!ensurePostMethodAndAccountSession(req, res)) {
    return;
  }

  const tradingFirmId = getTradingFirmIdFromRequest(req);
  if (!tradingFirmId) {
    respondAccountTradingNameError(
      req,
      res,
      400,
      errorFormat({ tradingFirmId: { error: 'required' } }),
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
  const trading = await fetchTradingDocForMainById(tradingFirmId, mainFrn);

  if (!trading.success || !trading.response) {
    respondAccountTradingNameError(
      req,
      res,
      404,
      errorFormat({ page: { error: 'general_error' } }),
    );
    return;
  }

  if (
    hasFcaVisibilityBlock(trading.response) ||
    hasFcaVisibilityBlock(ctx.firm)
  ) {
    respondAccountTradingNameError(
      req,
      res,
      403,
      errorFormat({ page: { error: 'general_error' } }),
    );
    return;
  }

  const deleteResult = await deleteTradingFirmDocument(trading.response);
  if (!deleteResult.success) {
    respondAccountTradingNameError(
      req,
      res,
      500,
      errorFormat({ page: { error: 'general_error' } }),
    );
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
