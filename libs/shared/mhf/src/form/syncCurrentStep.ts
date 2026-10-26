import { Entry } from '../types';

/**
 * Synchronizes the stepIndex of the form entry with the current step from the form submission.
 * We do this in two places:
 * - Here - for forward navigation on form submission to ensure the stepIndex is accurate.
 * - ValidateStepGuard - for back navigation on page load/SSR to ensure the stepIndex is accurate.
 * This was added to handle the new back-button behavior in Next.js (which removed re-hydration) and ensure the stepIndex remains consistent. see https://github.com/vercel/next.js/issues/94036
 * @param entry The current booking entry from the store.
 * @param currentStep The current step from the form submission.
 */
export function syncCurrentStep(entry: Entry, currentStep: string): void {
  const currentStepIndex = entry.steps.indexOf(currentStep);

  if (currentStepIndex === -1) {
    throw new TypeError(
      `[form-handler] Invalid currentStep: ${currentStep} - check that the step prop is passed in the FormWrapper and that the first step journey matches the initial step of the form`,
    );
  }

  if (entry.stepIndex !== currentStepIndex) {
    entry.stepIndex = currentStepIndex;
    entry.errors = {};
  }
}
