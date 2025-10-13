import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';
import { FormWrapper } from '../FormWrapper';
import { SectionsRenderer } from '../SectionsRenderer';
import { SubTitleRenderer } from '../SubTitleRenderer';

export const AboutPensionDivorce: StepComponent = ({ step }) => {
  const { t, tList } = useTranslation();
  const sections = tList('components.about-pension-divorce.sections');

  return (
    <div className="flex flex-col gap-4">
      <SubTitleRenderer
        content={t('components.about-pension-divorce.sub-title')}
        testId="about-pension-divorce-sub-title"
      />
      <SectionsRenderer
        sections={sections}
        testIdPrefix="about-pension-divorce"
      />
      <FormWrapper step={step}></FormWrapper>
    </div>
  );
};
