import { ListElement } from '@maps-digital/shared/ui';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { StepComponent } from '../../lib/types';
import { FormWrapper } from '../FormWrapper';

export const AboutStatePension: StepComponent = ({ step }) => {
  const { t, tList } = useTranslation();

  const list = tList('components.about-state-pension.items');

  return (
    <>
      <Paragraph
        className="text-2xl font-light mb-9"
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
      <FormWrapper step={step}></FormWrapper>
    </>
  );
};
