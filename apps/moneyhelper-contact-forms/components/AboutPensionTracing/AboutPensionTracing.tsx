import useTranslation from '@maps-react/hooks/useTranslation';
import {
  FormWrapper,
  SectionsRenderer,
  SubTitleRenderer,
} from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const AboutPensionTracing: StepComponent = () => {
  const { t, tList } = useTranslation();

  const sections = tList('components.about-pension-tracing.sections');

  return (
    <>
      <div className="flex flex-col gap-4">
        <SubTitleRenderer
          content={t('components.about-pension-tracing.sub-title')}
          testId="about-pension-tracing-sub-title"
        />
        <SectionsRenderer
          sections={sections}
          testIdPrefix="about-pension-tracing"
        />
      </div>
      <FormWrapper></FormWrapper>
    </>
  );
};
