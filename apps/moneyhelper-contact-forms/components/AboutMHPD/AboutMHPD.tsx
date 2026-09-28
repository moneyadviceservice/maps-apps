import useTranslation from '@maps-react/hooks/useTranslation';
import {
  FormWrapper,
  SectionsRenderer,
  SubTitleRenderer,
} from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

import { StepName } from '../../lib/constants';

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
        <SectionsRenderer sections={sections} testIdPrefix="about-mhpd" />
      </div>
      <FormWrapper nextStep={StepName.NAME} step={step}></FormWrapper>
    </>
  );
};
