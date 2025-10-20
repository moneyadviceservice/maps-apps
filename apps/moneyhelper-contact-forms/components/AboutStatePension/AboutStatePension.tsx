import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';
import { FormWrapper } from '../FormWrapper';
import { SectionsRenderer } from '../SectionsRenderer';
import { SubTitleRenderer } from '../SubTitleRenderer';

export const AboutStatePension: StepComponent = ({ step }) => {
  const { t, tList } = useTranslation();
  const sections = tList('components.about-state-pension.sections');

  return (
    <>
      <div className="flex flex-col gap-4">
        <SubTitleRenderer
          content={t('components.about-state-pension.sub-title')}
          testId="about-state-pension-sub-title"
        />
        <SectionsRenderer sections={sections} testIdPrefix="state-pension" />
      </div>
      <FormWrapper step={step}></FormWrapper>
    </>
  );
};
