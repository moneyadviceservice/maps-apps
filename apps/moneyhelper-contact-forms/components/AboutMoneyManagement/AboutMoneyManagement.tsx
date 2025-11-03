import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';
import { FormWrapper } from '../FormWrapper';
import { SectionsRenderer } from '../SectionsRenderer';
import { SubTitleRenderer } from '../SubTitleRenderer';

export const AboutMoneyManagement: StepComponent = ({ step }) => {
  const { t, tList } = useTranslation();
  const sections = tList('components.about-money-management.sections');

  return (
    <>
      <div className="flex flex-col gap-4">
        <SubTitleRenderer
          content={t('components.about-money-management.sub-title')}
          testId="about-money-management-sub-title"
        />
        <SectionsRenderer
          sections={sections}
          testIdPrefix="about-money-management"
        />
      </div>
      <FormWrapper step={step}></FormWrapper>
    </>
  );
};
