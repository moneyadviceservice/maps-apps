import type { Context } from '@netlify/functions';

import { cspViolationHandler } from '@maps-react/csp-policy/utils/netlify/cspViolationHandler';

export default async function saveCSPViolationDetails(
  req: Request,
  context: Context,
) {
  return cspViolationHandler(req, context, {
    appName: 'pensions-dashboard',
  });
}
