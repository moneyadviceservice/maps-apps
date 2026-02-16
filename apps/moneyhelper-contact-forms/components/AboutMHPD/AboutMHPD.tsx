import useTranslation from '@maps-react/hooks/useTranslation';
import {
  FormWrapper,
  SectionsRenderer,
  SubTitleRenderer,
} from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const AboutMHPD: StepComponent = () => {
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
      <FormWrapper></FormWrapper>
    </>
  );
};
