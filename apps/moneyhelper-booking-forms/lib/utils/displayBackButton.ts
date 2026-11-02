import { BookingEntry } from '../types';

/**
 * Determines whether to display the back button based on the provided parameters.
 * @param hideBackStep - A boolean indicating whether to hide the back step.
 * @param hideBackStepInEditMode - A boolean indicating whether to hide the back step when in edit mode.
 * @param entry - The booking entry object, which may be undefined.
 * @returns A boolean indicating whether to display the back button.
 */
export const displayBackButton = (
  hideBackStep?: boolean,
  hideBackStepInEditMode?: boolean,
  entry?: BookingEntry,
): boolean => {
  if (
    hideBackStep === true ||
    (hideBackStepInEditMode === true && entry?.editMode === true)
  ) {
    return false;
  }

  return true;
};
