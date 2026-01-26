import { RouteFlow } from '../types';

/**
 * Returns the steps array for the current flow.
 * - If entry.steps exists and is a non-empty array, returns entry.steps.
 * - Otherwise, returns steps from routeFlow.get(flow).
 * @param flow - The name of the current flow.
 * @param routeFlow - Map of flow names to their steps.
 * @returns {string[]} - The steps array for the flow.
 */
export function getFlowSteps(flow: string, routeFlow: RouteFlow): string[] {
  console.log('[getFlowSteps] Getting flow steps for flow:', flow); // DEBUG
  const flowConfig = routeFlow.get(flow);
  const { steps } = flowConfig || {};
  if (!steps || steps.length === 0) {
    throw new Error(`[getSteps] No steps found for flow: ${flow}`);
  }
  return steps;
}
