import { Button } from '@maps-react/common/components/Button';
import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';

export const AboutMHPD: StepComponent = () => {
  const { t, locale } = useTranslation();

  return (
    <div className="md:max-w-5xl">
      <H1 className="mb-4 text-blue-800" data-testid="about-mhpd-title">
        {t('components.about-mhpd.title')}
      </H1>
      <Paragraph className="mb-4" data-testid="about-mhpd-content">
        {t('components.about-mhpd.content')}
      </Paragraph>
      <form action="/api/form-handler" method="POST" noValidate>
        <input type="hidden" name="lang" value={locale} />
        <Button type="submit" className="mt-9" data-testid="continue-button">
          {t('common.continue')}
        </Button>
      </form>
    </div>
  );
};
