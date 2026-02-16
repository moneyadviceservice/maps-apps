import { GetServerSidePropsContext } from 'next';

import { RouteConfig } from '../types';
import { getCurrentStep } from '../utils';

/**
 * Runs the guards for the current step based on the provided route configuration and guard map.
 * @param context
 * @param routeConfig
 * @param guardMap - A mapping of guard names per application to their respective functions.
 */
export async function runGuardsBase(
  context: GetServerSidePropsContext,
  routeConfig: RouteConfig,
  guardMap: Record<
    string,
    (context: GetServerSidePropsContext) => Promise<void>
  >,
) {
  const currentStep = getCurrentStep(context);
  const route = routeConfig[currentStep];

  if (!route) {
    throw new Error(`[runGuardsBase] No route found for step: ${currentStep}`);
  }

  if (!route.guards || !Array.isArray(route.guards)) {
    throw new Error(
      `[runGuardsBase] Guards for step ${currentStep} are not defined or not an array`,
    );
  }

  for (const guardName of route.guards) {
    const guardFn = guardMap[guardName];
    if (typeof guardFn !== 'function') {
      throw new TypeError(
        `[runGuardsBase] Guard "${guardName}" for step "${currentStep}" is not a function.`,
      );
    }
    await guardFn(context);
  }
}
