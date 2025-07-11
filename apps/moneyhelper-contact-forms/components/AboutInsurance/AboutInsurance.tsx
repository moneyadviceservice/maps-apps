import { Paragraph } from '@maps-react/common/components/Paragraph';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { StepComponent } from '../../lib/types';

export const AboutInsurance: StepComponent = () => {
  const { t } = useTranslation();

  return (
    <div className="md:max-w-5xl">
      <Paragraph
        className="text-2xl font-light mb-9"
        data-testid="about-insurance-sub-title"
      >
        {t('components.about-insurance.sub-title')}
      </Paragraph>

      <UrgentCallout
        border="teal"
        variant="calculator"
        className="text-3xl font-semibold md:text-4xl md:max-w-4xl mb-9"
      >
        <Markdown
          data-testid="about-insurance-content"
          content={t('components.about-insurance.callout')}
        />
      </UrgentCallout>
      <Markdown
        data-testid="about-insurance-content"
        content={t('components.about-insurance.content')}
      />
    </div>
  );
};
