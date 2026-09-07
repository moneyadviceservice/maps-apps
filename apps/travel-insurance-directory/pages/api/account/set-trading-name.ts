import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import {
  ensurePostMethodAndAccountSession,
  loadPrincipalFirmForTradingMutation,
  respondAccountTradingNameError,
  respondTradingNameMutationSuccess,
} from 'lib/account/resolveAccountTradingNameRequest';
import { withAccountSession } from 'lib/accountAuth/withAccountSession';
import { upsertTradingFirm } from 'lib/account/tradingFirm';
import { errorFormat } from 'utils/api/errorFormat';
import { IronSessionObject } from 'types/iron-session';

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

  const result = await upsertTradingFirm({
    name,
    mainFrn,
    mainFirmId: ctx.firmId,
  });

  if (!result.success) {
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
