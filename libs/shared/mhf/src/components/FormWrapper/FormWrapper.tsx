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
};

export const FormWrapper = ({
  children,
  className,
  step,
  isLastStep = false,
}: FormWrapperProps) => {
  const { t, locale } = useTranslation();
  const buttonText = getButtonText(t, step, isLastStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <form
      action="/api/form-handler"
      method="POST"
      noValidate
      aria-label="form"
      className={twMerge(`pt-6 md:pt-8`, className)}
      onSubmit={() => setIsSubmitting(true)}
    >
      <input type="hidden" name="lang" value={locale} />
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
 * Get the button text based whether it's the last step or if a custom step text exists. Otherwise defaults to 'continue-text'.
 * @param t
 * @param step
 * @returns
 */
export const getButtonText = (
  t: (key: string) => string,
  step: string | undefined,
  isLastStep: boolean,
): string => {
  if (isLastStep) {
    return 'common.form.button.send-text';
  }
  const customKey = `common.form.button.${step}`;
  return safeT(t, customKey) || 'common.form.button.continue-text';
};
