import { Entry } from '../types';

/**
 * Rebases the steps array in the store entry based on the submitted next step token.
 * If a stepName token is provided, it replaces any future steps in the flow with the submitted next step, allowing for dynamic branching based on user input.
 * This enables users to go back to junctions, pick a different flow, and follow that path instead.
 * @param entry - The current store entry object containing the flow state.
 * @param stepName - The submitted next step token indicating the next step in the flow.
 * @returns void
 */
export function resolveNextSteps(entry: Entry, stepName?: string): void {
  if (stepName) {
    // Keep completed prefix and replace remaining future path with the submitted next step.
    entry.steps.splice(entry.stepIndex + 1, Infinity, stepName);
  }
}
