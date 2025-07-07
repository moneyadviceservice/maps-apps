import { Button } from '@maps-react/common/components/Button';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { StepName } from '../../lib/constants';
import { StepComponent } from '../../lib/types';

export const Guidance: StepComponent = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex flex-col gap-2 py-4 md:gap-4">
        <Paragraph
          className="mb-2 text-2xl font-light md:mb-4"
          data-testid="guidance-intro"
        >
          {t('components.guidance.intro')}
        </Paragraph>
        <Markdown
          className="mb-2 md:mb-4"
          data-testid="guidance-content"
          content={t('components.guidance.content')}
        ></Markdown>
      </div>

      <Button
        type="button"
        as="a"
        href={StepName.ENQUIRY_TYPE}
        variant="primary"
        data-testid="guidance-continue-button"
        className="w-full my-4 md:w-auto"
      >
        {t('common.continue')}
      </Button>
    </>
  );
};
