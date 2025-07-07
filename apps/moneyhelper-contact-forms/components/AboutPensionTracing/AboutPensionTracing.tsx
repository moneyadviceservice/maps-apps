import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { StepComponent } from '../../lib/types';
import { FormWrapper } from '../FormWrapper';

export const AboutPensionTracing: StepComponent = ({ step }) => {
  const { t } = useTranslation();

  return (
    <>
      <Paragraph
        className="text-2xl font-light mb-9"
        data-testid="about-pension-tracing-sub-title"
      >
        {t('components.about-pension-tracing.sub-title')}
      </Paragraph>
      <Markdown
        data-testid="about-pension-tracing-content"
        content={t('components.about-pension-tracing.content')}
      />
      <FormWrapper step={step}></FormWrapper>
    </>
  );
};
