import { cspViolationHandler } from '../../../../libs/shared/csp-policy/src/utils/netlify/cspViolationHandler.ts';
import type { Context } from '@netlify/functions';

export default async function saveCSPViolationDetails(
  req: Request,
  context: Context,
) {
  return cspViolationHandler(req, context, {
    appName: 'pensions-dashboard',
  });
}
