import { Button } from '@maps-react/common/components/Button';
import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { StepName } from '../../lib/constants';
import { StepComponent } from '../../lib/types';

export const Guidance: StepComponent = () => {
  const { t } = useTranslation();
  return (
    <div className="mt-20">
      <H1 className="mb-4 text-blue-800" data-testid="guidance-title">
        {t('components.guidance.title')}
      </H1>
      <Paragraph
        className="text-3xl font-light text-gray-800 mb-9"
        data-testid="guidance-intro"
      >
        {t('components.guidance.intro')}
      </Paragraph>
      <Markdown
        className="text-gray-800"
        data-testid="guidance-content"
        content={t('components.guidance.content')}
      ></Markdown>

      <Button
        type="button"
        as="a"
        href={StepName.ENQUIRY_TYPE}
        variant="primary"
        data-testid="back-button"
      >
        {t('common.continue')}
      </Button>
    </div>
  );
};
