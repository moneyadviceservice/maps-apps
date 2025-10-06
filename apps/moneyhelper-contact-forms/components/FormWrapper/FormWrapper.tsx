import { Button } from '@maps-react/common/components/Button';
import useTranslation from '@maps-react/hooks/useTranslation';

import { Entry } from '../../lib/types';
import { getFlowSteps } from '../../lib/utils';

type FormWrapperProps = {
  children?: React.ReactNode;
  step: string;
  className?: string;
  entry?: Entry;
};

export const FormWrapper = ({
  children,
  step,
  className,
  entry,
}: FormWrapperProps) => {
  const { t, locale } = useTranslation();
  const ariaLabel = `Contact form for Step: ${step}`;

  const buttonText = isLastInputStep(entry)
    ? t('common.form.button.send-text')
    : t('common.form.button.continue-text');

  return (
    <form
      action="/api/form-handler"
      method="POST"
      noValidate
      aria-label={ariaLabel}
      className={className}
    >
      <input type="hidden" name="lang" value={locale} />
      {children}
      <Button
        type="submit"
        className="w-full mt-10 mb-4 md:w-auto"
        data-testid="continue-button"
      >
        {t(buttonText)}
      </Button>
    </form>
  );
};

/**
 * Determine if the current step is the last input step in the flow
 * This is used to dynamically change the button text
 * @param entry
 * @param step
 * @returns
 */
const isLastInputStep = (entry: Entry | undefined): boolean => {
  if (!entry?.data) {
    return false;
  }
  const steps: string[] = getFlowSteps(entry);
  const currentStepIndex = entry.stepIndex;

  return currentStepIndex === steps.length - 3;
};
