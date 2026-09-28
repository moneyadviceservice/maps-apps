import { BookingEntry } from '../types';

/**
 * Resolves the next step while in edit mode without rebasing future steps (rebasing takes place in resolveNextSteps).
 *
 * In edit mode (for example from confirm-details), the existing flow should be
 * preserved so users can change previous answers without losing their current
 * place. Unlike resolveNextSteps, this helper only moves within the existing
 * steps array (or inserts a missing next step token directly after the current
 * step) and updates stepIndex accordingly.
 *
 * The below examples match those in the unit tests for this function.
 *
 * @example
 * // Existing next step is found later in the flow.
 * const entry = {
 *   steps: ['appointment-type', 'contact-details', 'confirm-details'],
 *   stepIndex: 0,
 * } as BookingEntry;
 * resolveNextEditStep(entry, 'confirm-details');
 * // entry.stepIndex === 2
 * // entry.steps unchanged
 *
 * @example
 * // Next step is missing, so it is inserted after the current step.
 * const entry = {
 *   steps: ['appointment-type', 'contact-details', 'confirm-details'],
 *   stepIndex: 0,
 * } as BookingEntry;
 * resolveNextEditStep(entry, 'communication-preferences');
 * // entry.steps === [
 * //   'appointment-type',
 * //   'communication-preferences',
 * //   'contact-details',
 * //   'confirm-details',
 * // ]
 * // entry.stepIndex === 1
 *
 * @example
 * // No next step token, so progression moves forward by one.
 * const entry = {
 *   steps: ['appointment-type', 'contact-details', 'confirm-details'],
 *   stepIndex: 0,
 * } as BookingEntry;
 * resolveNextEditStep(entry, '');
 * // entry.stepIndex === 1
 * // entry.steps unchanged
 *
 * @param entry - The current store entry object.
 * @param stepName - The next step token to resolve.
 * @returns void
 */
export function resolveNextEditStep(entry: BookingEntry, stepName: string) {
  const nextIndex =
    stepName != null ? entry.steps.indexOf(stepName, entry.stepIndex + 1) : -1;

  if (nextIndex > -1) {
    // If the next step is found in the steps array, update the stepIndex to point to that step.
    entry.stepIndex = nextIndex;
  } else if (stepName) {
    // Insert missing branch step but keep the existing tail.
    entry.steps.splice(entry.stepIndex + 1, 0, stepName);
    entry.stepIndex++;
  } else {
    // No explicit nextStep token; keep current progression.
    entry.stepIndex++;
  }
}
