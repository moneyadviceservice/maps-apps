import { Button } from '@maps-react/common/components/Button';
import useTranslation from '@maps-react/hooks/useTranslation';

import { safeT } from '../../lib/utils';

type FormWrapperProps = {
  children?: React.ReactNode;
  step: string;
  className?: string;
};

export const FormWrapper = ({
  children,
  step,
  className,
}: FormWrapperProps) => {
  const { t, locale } = useTranslation();
  const ariaLabel = `Contact form for Step: ${step}`;
  const button =
    safeT(t, `components.${step}.form.button.text`) ??
    t('common.form.button.text');
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
        {t(button)}
      </Button>
    </form>
  );
};
