import useTranslation from '@maps-react/hooks/useTranslation';
import {
  FormWrapper,
  SectionsRenderer,
  SubTitleRenderer,
} from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

import { StepName } from '../../lib/constants';

export const AboutMoneyManagement: StepComponent = () => {
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
      <FormWrapper nextStep={StepName.NAME}></FormWrapper>
    </>
  );
};
