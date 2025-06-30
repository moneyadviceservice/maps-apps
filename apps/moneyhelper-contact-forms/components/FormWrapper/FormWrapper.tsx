import { Button } from '@maps-react/common/components/Button';
import useTranslation from '@maps-react/hooks/useTranslation';

type FormWrapperProps = {
  children: React.ReactNode;
  step?: string;
};

export const FormWrapper = ({ children, step }: FormWrapperProps) => {
  const { t, locale } = useTranslation();
  const ariaLabel = step ? `Contact form for Step: ${step}` : 'Contact form';

  return (
    <form
      action="/api/form-handler"
      method="POST"
      noValidate
      aria-label={ariaLabel}
    >
      <input type="hidden" name="lang" value={locale} />
      {children}
      <Button type="submit" className="mt-9" data-testid="continue-button">
        {t('common.continue')}
      </Button>
    </form>
  );
};
