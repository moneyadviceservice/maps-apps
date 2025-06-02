import { ListElement } from '@maps-digital/shared/ui';

import { Button } from '@maps-react/common/components/Button';
import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { StepComponent } from '../../lib/types';

export const AboutStatePension: StepComponent = () => {
  const { t, tList, locale } = useTranslation();

  const list = tList('components.about-state-pension.items');

  return (
    <div className="md:max-w-5xl">
      <H1
        className="mb-4 text-blue-800"
        data-testid="about-state-pension-title"
      >
        {t('components.about-state-pension.title')}
      </H1>
      <Paragraph
        className="text-2xl font-light text-gray-800 mb-9"
        data-testid="about-state-pension-sub-title"
      >
        {t('components.about-state-pension.sub-title')}
      </Paragraph>
      <Markdown
        data-testid="about-state-pension-content"
        content={t('components.about-state-pension.content')}
      />
      <ListElement
        items={list.map((item: string) => (
          <Markdown key={item.slice(0, 8)} content={item} />
        ))}
        variant="unordered"
        color="dark"
        className="ml-8"
        data-testid="about-state-pension-list"
      />
      <Paragraph className="mb-4" data-testid="about-state-pension-footer">
        {t('components.about-state-pension.footer')}
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
