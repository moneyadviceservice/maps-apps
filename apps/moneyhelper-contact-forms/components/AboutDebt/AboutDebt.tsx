import { Button } from '@maps-react/common/components/Button';
import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { StepComponent } from '../../lib/types';

export const AboutDebt: StepComponent = () => {
  const { t, locale } = useTranslation();

  return (
    <div className="md:max-w-5xl">
      <H1 className="mb-4 text-blue-800" data-testid="about-debt-title">
        {t('components.about-debt.title')}
      </H1>
      <Paragraph
        className="text-2xl font-light text-gray-800 mb-9"
        data-testid="about-debt-subTitle"
      >
        {t('components.about-debt.subTitle')}
      </Paragraph>

      <UrgentCallout
        border="teal"
        variant="calculator"
        className="text-3xl font-semibold text-gray-800 md:text-4xl md:max-w-4xl mb-9"
      >
        <Markdown
          data-testid="about-debt-content"
          content={t('components.about-debt.callout')}
        />
      </UrgentCallout>
      <Markdown
        data-testid="about-debt-content"
        content={t('components.about-debt.content')}
      />
      <form action="/api/form-handler" method="POST" noValidate>
        <input type="hidden" name="lang" value={locale} />
        <Button type="submit" className="mt-9" data-testid="continue-button">
          {t('common.continue')}
        </Button>
      </form>
    </div>
  );
};
