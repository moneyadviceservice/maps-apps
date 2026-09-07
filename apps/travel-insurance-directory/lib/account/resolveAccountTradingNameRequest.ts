import type { NextApiRequest, NextApiResponse } from 'next';

import { resolveAccountMainFirm } from 'lib/account/resolveAccountMainFirm';
import type { IronSessionObject } from 'types/iron-session';
import type {
  MainTravelInsuranceFirmDocument,
  TradingTravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';
import { errorFormat } from 'utils/api/errorFormat';
import { respond } from 'utils/api/respond';
import { wantsJson } from 'utils/api/wantsJson/wantsJson';

export type AccountTradingNameRouteContext = {
  firm: MainTravelInsuranceFirmDocument;
  firmId: string;
  mainFrn: number | undefined;
};

export type AuthenticatedAccountTradingRequest = NextApiRequest & {
  session: IronSessionObject & {
    isAccountAuthenticated: true;
    accountEmail: string;
  };
};

function accountTradingRedirectDestination(req: NextApiRequest): string {
  const referer = req.headers.referer;
  if (typeof referer === 'string' && referer.includes('/account')) {
    return referer;
  }
  return '/account';
}

/** HTML form posts must redirect back to account without using respond()'s default `/`. */
export function respondAccountTradingNameError(
  req: NextApiRequest,
  res: NextApiResponse,
  status: number,
  data: Record<string, unknown> = {},
) {
  if (wantsJson(req)) {
    res.status(status).json(data);
    return;
  }

  const destination =
    status === 401 ? '/account/login' : accountTradingRedirectDestination(req);
  res.redirect(303, destination);
}

export function ensurePostMethodAndAccountSession(
  req: NextApiRequest & { session: IronSessionObject },
  res: NextApiResponse,
): req is AuthenticatedAccountTradingRequest {
  if (req.method !== 'POST') {
    if (wantsJson(req)) {
      respond(req, res, {
        status: 405,
        headers: { Allow: 'POST' },
        data: errorFormat({ page: { error: 'general_error' } }),
      });
    } else {
      respondAccountTradingNameError(req, res, 405);
    }
    return false;
  }

  if (!req.session?.isAccountAuthenticated || !req.session.accountEmail) {
    respondAccountTradingNameError(
      req,
      res,
      401,
      errorFormat({ page: { error: 'general_error' } }),
    );
    return false;
  }

  return true;
}

/**
 * Loads the authenticated principal's firm. On failure, responds with 404.
 */
export async function loadPrincipalFirmForTradingMutation(
  req: AuthenticatedAccountTradingRequest,
  res: NextApiResponse,
  options: { requireMainFrnAsNumber: boolean },
): Promise<AccountTradingNameRouteContext | undefined> {
  const { firm } = await resolveAccountMainFirm(req.session);
  const firmId = firm?.id;
  const mainFrn = firm?.fca_number;

  const missingMainFrn =
    options.requireMainFrnAsNumber && typeof mainFrn !== 'number';

  if (!firm || !firmId || missingMainFrn) {
    respondAccountTradingNameError(
      req,
      res,
      404,
      errorFormat({ page: { error: 'general_error' } }),
    );
    return undefined;
  }

  return { firm, firmId, mainFrn };
}

export function tradingDocOwnedByMain(
  trading: TradingTravelInsuranceFirmDocument,
  ctx: AccountTradingNameRouteContext,
): boolean {
  if (trading.main_firm_id === ctx.firmId) {
    return true;
  }

  // Legacy trading rows loaded before main_firm_id was set (same FRN as main).
  if (
    !trading.main_firm_id &&
    typeof ctx.mainFrn === 'number' &&
    trading.fca_number === ctx.mainFrn
  ) {
    return true;
  }

  return false;
}

export function respondTradingNameMutationSuccess(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (wantsJson(req)) {
    res.status(200).json({ ok: true });
    return;
  }

  const referer = req.headers.referer;
  const destination =
    typeof referer === 'string' && referer.includes('/account')
      ? referer
      : '/account';
  res.redirect(302, destination);
}
