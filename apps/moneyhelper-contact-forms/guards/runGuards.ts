import { GetServerSidePropsContext } from 'next';

import {
  cookieGuard,
  runGuardsBase,
  validateStepGuard,
} from '@maps-react/mhf/guards';

import { Guards } from '../lib/constants';
import { routeConfig } from '../routes/routeConfig';
import { autoAdvanceGuard } from './autoAdvanceGuard';

export const guardMap = {
  [Guards.COOKIE_GUARD]: cookieGuard,
  [Guards.VALIDATE_STEP_GUARD]: validateStepGuard,
  [Guards.AUTO_ADVANCE_GUARD]: autoAdvanceGuard,
};

export const runGuards = (context: GetServerSidePropsContext) =>
  runGuardsBase(context, routeConfig, guardMap);
