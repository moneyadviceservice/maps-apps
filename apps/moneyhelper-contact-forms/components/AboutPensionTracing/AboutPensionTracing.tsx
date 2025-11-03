import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';
import { FormWrapper } from '../FormWrapper';
import { SectionsRenderer } from '../SectionsRenderer';
import { SubTitleRenderer } from '../SubTitleRenderer';

export const AboutPensionTracing: StepComponent = ({ step }) => {
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
      <FormWrapper step={step}></FormWrapper>
    </>
  );
};
