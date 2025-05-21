import { routeFlow } from '../../routes/routeFlow';
import { Entry } from '../types';

/**
 * Retrieves the given flow steps by the flow name.
 * @param entry - The entry object containing the flow data.
 * @returns {string[]} - The steps for the flow or an empty array if the entry is invalid.
 * @throws {Error} - If the flow is not found or has no steps.
 */
export function getFlowSteps(entry: Entry): string[] {
  if (!entry?.data) {
    return [];
  }

  const { flow } = entry.data;

  const steps = routeFlow.get(flow);

  if (!steps || steps.length === 0) {
    throw new Error(`No steps found for flow: ${steps}`);
  }

  return steps;
}
