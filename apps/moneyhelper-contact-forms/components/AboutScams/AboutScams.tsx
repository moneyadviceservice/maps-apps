import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';
import { FormWrapper } from '../FormWrapper';
import { SectionsRenderer } from '../SectionsRenderer';
import { SubTitleRenderer } from '../SubTitleRenderer';

export const AboutScams: StepComponent = ({ step }) => {
  const { t, tList } = useTranslation();
  const sections = tList('components.about-scams.sections');

  return (
    <>
      <div className="flex flex-col gap-4">
        <SubTitleRenderer
          content={t('components.about-scams.sub-title')}
          testId="about-scams-sub-title"
        />
        <SectionsRenderer sections={sections} testIdPrefix="about-scams" />
      </div>
      <FormWrapper step={step}></FormWrapper>
    </>
  );
};
