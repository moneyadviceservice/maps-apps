import { useState } from 'react';

import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import useTranslation from '@maps-react/hooks/useTranslation';

import { safeT } from '../../utils/safeT';

type FormWrapperProps = {
  children?: React.ReactNode;
  className?: string;
  step?: string;
  isLastStep?: boolean;
  saveChanges?: boolean;
  nextStep?: string;
  ariaLabel?: string;
};

/**
 * Wraps form content in a form element with a submit button.
 * - For linear/non-decision steps, `nextStep` is passed as a prop and rendered as a hidden input, so the backend knows the next step after submission.
 * - For junctions/decision points, the next step is determined by user input (e.g., radio button), and `nextStep` is set in the child component (see OptionTypes.tsx).
 * This pattern ensures JS-free navigation and keeps form logic maintainable.
 * @returns Form element with navigation logic.
 */
export const FormWrapper = ({
  children,
  className,
  step,
  isLastStep = false,
  saveChanges = false,
  nextStep,
  ariaLabel = 'form',
}: FormWrapperProps) => {
  const { t, locale } = useTranslation();
  const buttonText = getButtonText(t, step, isLastStep, saveChanges);
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <form
      action="/api/form-handler"
      method="POST"
      noValidate
      aria-label={ariaLabel}
      className={twMerge(`pt-6 md:pt-8`, className)}
      onSubmit={() => setIsSubmitting(true)}
    >
      {/* Carries the URL-derived locale through JavaScript-free form submissions. */}
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="currentStep" value={step} />
      {nextStep && <input type="hidden" name="nextStep" value={nextStep} />}
      {children && <div className="pb-6 md:pb-8">{children}</div>}
      <Button
        type="submit"
        className="w-full my-8 md:w-auto"
        data-testid="form-button"
        variant={isSubmitting ? 'loading' : 'primary'}
        disabled={isSubmitting}
      >
        {t(buttonText)}
      </Button>
    </form>
  );
};

/**
 * Return the correct button text based on the current step and whether it's the last step or if the user is making changes to an existing entry (edit mode in booking forms app). Always set a default value for the step parameter to avoid undefined values.
 * @param t
 * @param step
 * @param isLastStep
 * @param saveChanges
 * @returns
 */
export const getButtonText = (
  t: (key: string) => string,
  step: string | undefined,
  isLastStep: boolean,
  saveChanges = false,
): string => {
  const stepKey = step || 'continue-text';
  if (isLastStep) {
    return 'common.form.button.send-text';
  }
  if (saveChanges) {
    return 'common.form.button.save-changes-text';
  }
  const customKey = `common.form.button.${stepKey}`;
  return safeT(t, customKey) || 'common.form.button.continue-text';
};
