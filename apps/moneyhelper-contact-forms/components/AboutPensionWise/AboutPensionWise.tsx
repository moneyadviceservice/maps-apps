import { ExpandableSection, ListElement } from '@maps-digital/shared/ui';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { StepComponent } from '../../lib/types';
import { FormWrapper } from '../FormWrapper';

export const AboutPensionWise: StepComponent = ({ step }) => {
  const { t, tList } = useTranslation();

  const list = tList('components.about-pension-wise.items');

  return (
    <>
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
      <FormWrapper step={step}></FormWrapper>
    </>
  );
};
