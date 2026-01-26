import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import useTranslation from '@maps-react/hooks/useTranslation';

import { Entry } from '../../types';
import { safeT } from '../../utils/safeT';

type FormWrapperProps = {
  children?: React.ReactNode;
  className?: string;
  entry?: Entry;
  step?: string;
  errors?: string;
};

export const FormWrapper = ({
  children,
  className,
  entry,
  step,
  errors,
}: FormWrapperProps) => {
  const { t, locale } = useTranslation();

  const buttonText = getButtonText(t, entry, step);
  return (
    <form
      action="/api/form-handler"
      method="POST"
      noValidate
      aria-label="form"
      className={twMerge(`pt-6 md:pt-8`, !!errors && `pt-2 md:pt-4`, className)}
    >
      <input type="hidden" name="lang" value={locale} />
      {children && <div className="pb-6 md:pb-8">{children}</div>}
      <Button
        type="submit"
        className="w-full my-8 md:w-auto"
        data-testid="form-button"
      >
        {t(buttonText)}
      </Button>
    </form>
  );
};

/**
 * Gets the button text key based on the entry and step.
 * 1.) Looks at the flowConfig to see if there is a lastInputStep defined for the current flow.
 * 2.) Looks for a custom button text for the current step. Defined in the translation files under common.form.button.[stepName]
 * 3.) Else defaults to 'common.form.button.send-text'
 * @param t
 * @param entry
 * @param step
 * @returns
 */
export const getButtonText = (
  t: (key: string) => string,
  entry: Entry | undefined,
  step: string | undefined,
): string => {
  if (entry) {
    const { steps, stepIndex, config } = entry;
    const isLastStep = steps[stepIndex] === config.lastInputStep;
    if (isLastStep) {
      return 'common.form.button.send-text';
    }
  }
  const customKey = `common.form.button.${step}`;
  return safeT(t, customKey) || 'common.form.button.continue-text';
};
