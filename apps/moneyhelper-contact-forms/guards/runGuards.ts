import { GetServerSidePropsContext } from 'next';

import { Guards } from '../lib/constants';
import { RouteConfig } from '../lib/types';
import { getCurrentStep } from '../lib/utils';
import { autoAdvanceGuard } from './autoAdvanceGuard';
import { cookieGuard } from './cookieGuard';
import { validateStepGuard } from './validateStepGuard';

/**
 * Map of guard names to their respective functions.
 */
export const guardMap: Record<
  string,
  (context: GetServerSidePropsContext) => Promise<void>
> = {
  [Guards.COOKIE_GUARD]: cookieGuard,
  [Guards.VALIDATE_STEP_GUARD]: validateStepGuard,
  [Guards.AUTO_ADVANCE_GUARD]: autoAdvanceGuard,
};

/**
 * Executes all guards for the current step in the route configuration. (see routeConfig.js)
 * @param context
 * @param routeConfig
 */
export const runGuards = async (
  context: GetServerSidePropsContext,
  routeConfig: RouteConfig,
) => {
  const currentStep = getCurrentStep(context);
  const route = routeConfig[currentStep];

  if (!route) {
    throw new Error(`[runGuards] No route found for step: ${currentStep}`);
  }

  if (!route.guards || !Array.isArray(route.guards)) {
    throw new Error(
      `[runGuards] Guards for step ${currentStep} are not defined or not an array`,
    );
  }

  for (const guardName of route.guards) {
    const guardFn = guardMap[guardName as Guards];
    if (typeof guardFn !== 'function') {
      throw new Error(
        `[runGuards] Guard "${guardName}" for step "${currentStep}" is not a function.`,
      );
    }
    await guardFn(context);
  }
};
