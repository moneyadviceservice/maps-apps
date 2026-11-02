import { GetServerSidePropsContext } from 'next';

import {
  cookieGuard,
  createAutoAdvanceGuard,
  runGuardsBase,
  validateStepGuard,
} from '@maps-react/mhf/guards';

import { Guards } from '../lib/constants';
import { flowConfig } from '../routes/flowConfig';
import { routeConfig } from '../routes/routeConfig';
import { sessionIDGuard } from './sessionIDGuard';

const autoAdvanceGuard = createAutoAdvanceGuard(flowConfig);

export const guardMap = {
  [Guards.COOKIE_GUARD]: cookieGuard,
  [Guards.VALIDATE_STEP_GUARD]: validateStepGuard,
  [Guards.AUTO_ADVANCE_GUARD]: autoAdvanceGuard,
  [Guards.SESSION_ID_GUARD]: sessionIDGuard,
};

export const runGuards = (context: GetServerSidePropsContext) =>
  runGuardsBase(context, routeConfig, guardMap);
