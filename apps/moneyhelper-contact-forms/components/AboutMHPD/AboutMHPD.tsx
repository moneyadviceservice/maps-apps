import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';
import { FormWrapper } from '../FormWrapper';
import { SectionsRenderer } from '../SectionsRenderer';
import { SubTitleRenderer } from '../SubTitleRenderer';

export const AboutMHPD: StepComponent = ({ step }) => {
  const { t, tList } = useTranslation();
  const sections = tList('components.about-mhpd.sections');

  return (
    <>
      <div className="flex flex-col gap-4">
        <SubTitleRenderer
          content={t('components.about-mhpd.sub-title')}
          testId="about-mhpd-sub-title"
        />
        <SectionsRenderer sections={sections} testIdPrefix="about-debt" />
      </div>
      <FormWrapper step={step}></FormWrapper>
    </>
  );
};
