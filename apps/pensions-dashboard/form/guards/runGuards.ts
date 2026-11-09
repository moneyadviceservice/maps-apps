import { GetServerSidePropsContext } from 'next';

import {
  cookieGuard,
  runGuardsBase,
  validateStepGuard,
} from '@maps-react/mhf/guards';

import { FORM_BASE_PATH, Guards } from '../constants';
import { routeConfig } from '../routes/routeConfig';

export const guardMap = {
  [Guards.COOKIE_GUARD]: cookieGuard,
  [Guards.VALIDATE_STEP_GUARD]: validateStepGuard,
};

export const runGuards = (context: GetServerSidePropsContext) =>
  runGuardsBase(context, routeConfig, guardMap, FORM_BASE_PATH);
