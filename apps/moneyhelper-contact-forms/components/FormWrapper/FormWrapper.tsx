import { Button } from '@maps-react/common/components/Button';
import useTranslation from '@maps-react/hooks/useTranslation';

type FormWrapperProps = {
  children?: React.ReactNode;
  step?: string;
  className?: string;
};

export const FormWrapper = ({
  children,
  step,
  className,
}: FormWrapperProps) => {
  const { t, locale } = useTranslation();
  const ariaLabel = step ? `Contact form for Step: ${step}` : 'Contact form';

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
        className="w-full my-4 md:w-auto"
        data-testid="continue-button"
      >
        {t('common.continue')}
      </Button>
    </form>
  );
};
