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
import { clearEditModeGuard } from './clearEditModeGuard';
import { editModeInitGuard } from './editModeInitGuard';
import { journeyEntryGuard } from './journeyEntryGuard';

const autoAdvanceGuard = createAutoAdvanceGuard(flowConfig);

export const guardMap: Record<
  string,
  (context: GetServerSidePropsContext) => Promise<void>
> = {
  [Guards.COOKIE_GUARD]: cookieGuard,
  [Guards.VALIDATE_STEP_GUARD]: validateStepGuard,
  [Guards.AUTO_ADVANCE_GUARD]: autoAdvanceGuard,
  [Guards.EDIT_MODE_INIT_GUARD]: editModeInitGuard,
  [Guards.CLEAR_EDIT_MODE_GUARD]: clearEditModeGuard,
  [Guards.JOURNEY_ENTRY_GUARD]: journeyEntryGuard,
};

export const runGuards = (context: GetServerSidePropsContext) =>
  runGuardsBase(context, routeConfig, guardMap);
