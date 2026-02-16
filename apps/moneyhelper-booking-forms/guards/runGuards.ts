import { GetServerSidePropsContext } from 'next';

import {
  cookieGuard,
  runGuardsBase,
  validateStepGuard,
} from '@maps-react/mhf/guards';

import { Guards } from '../lib/constants';
import { routeConfig } from '../routes/routeConfig';

export const guardMap: Record<
  string,
  (context: GetServerSidePropsContext) => Promise<void>
> = {
  [Guards.COOKIE_GUARD]: cookieGuard,
  [Guards.VALIDATE_STEP_GUARD]: validateStepGuard,
};

export const runGuards = (context: GetServerSidePropsContext) =>
  runGuardsBase(context, routeConfig, guardMap);
