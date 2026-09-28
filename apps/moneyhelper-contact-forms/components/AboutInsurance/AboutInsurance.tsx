import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import useTranslation from '@maps-react/hooks/useTranslation';
import { SectionsRenderer, SubTitleRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';
import { Markdown } from '@maps-react/vendor/components/Markdown';

export const AboutInsurance: StepComponent = () => {
  const { t, tList } = useTranslation();
  const sections = tList('components.about-insurance.sections');

  return (
    <div className="flex flex-col gap-4">
      <SubTitleRenderer
        content={t('components.about-insurance.sub-title')}
        testId="about-insurance-sub-title"
      />
      <SectionsRenderer sections={sections} testIdPrefix="about-insurance" />
      <UrgentCallout
        border="teal"
        variant="calculator"
        className="text-3xl font-semibold md:text-4xl md:max-w-4xl mb-9"
      >
        <Markdown content={t('components.about-insurance.callout')} />
      </UrgentCallout>
      <Markdown
        data-testid="about-insurance-footer-content"
        content={t('components.about-insurance.footer.content')}
      />
    </div>
  );
};
