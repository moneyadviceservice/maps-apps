import { Button } from '@maps-react/common/components/Button';
import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { StepComponent } from '../../lib/types';

export const AboutPensionTracing: StepComponent = () => {
  const { t, locale } = useTranslation();

  return (
    <div className="md:max-w-5xl">
      <H1
        className="mb-4 text-blue-800"
        data-testid="about-pension-tracing-title"
      >
        {t('components.about-pension-tracing.title')}
      </H1>
      <Paragraph
        className="text-2xl font-light text-gray-800 mb-9"
        data-testid="about-pension-tracing-sub-title"
      >
        {t('components.about-pension-tracing.sub-title')}
      </Paragraph>
      <Markdown
        data-testid="about-pension-tracing-content"
        content={t('components.about-pension-tracing.content')}
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
