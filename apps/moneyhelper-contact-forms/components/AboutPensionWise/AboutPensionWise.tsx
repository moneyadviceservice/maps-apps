import { ExpandableSection, ListElement } from '@maps-digital/shared/ui';

import { Button } from '@maps-react/common/components/Button';
import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { StepComponent } from '../../lib/types';

export const AboutPensionWise: StepComponent = () => {
  const { t, tList, locale } = useTranslation();

  const list = tList('components.about-pension-wise.items');

  return (
    <div className="md:max-w-5xl">
      <H1 className="mb-4 text-blue-800" data-testid="about-pension-wise-title">
        {t('components.about-pension-wise.title')}
      </H1>
      <Markdown
        data-testid="about-pension-wise-sub-title"
        content={t('components.about-pension-wise.sub-title')}
      />
      <ListElement
        items={list.map((item: string) => (
          <Markdown key={item.slice(0, 8)} content={item} />
        ))}
        variant="unordered"
        color="dark"
        className="ml-8"
        data-testid="about-pension-wise-list"
      />
      <Markdown
        data-testid="about-pension-wise-content"
        content={t('components.about-pension-wise.content')}
      />
      <div className="mt-12">
        <ExpandableSection
          title={t('components.about-pension-wise.expandable-section.title')}
        >
          <Paragraph>
            {t('components.about-pension-wise.expandable-section.content')}
          </Paragraph>
        </ExpandableSection>
      </div>
      <form action="/api/form-handler" method="POST" noValidate>
        <input type="hidden" name="lang" value={locale} />
        <Button type="submit" className="mt-9" data-testid="continue-button">
          {t('common.continue')}
        </Button>
      </form>
    </div>
  );
};
