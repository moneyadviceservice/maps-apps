import { GetServerSidePropsContext } from 'next';

import { RouteConfig } from '../lib/types';
import { getCurrentStep } from '../lib/utils';

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

  for (const guard of route.guards) {
    if (typeof guard !== 'function') {
      throw new Error(
        `[runGuards] Guard for step "${currentStep}" is not a function. Found: ${typeof guard}`,
      );
    }
    await guard(context);
  }
};
