import useTranslation from '@maps-react/hooks/useTranslation';
import {
  FormWrapper,
  SectionsRenderer,
  SubTitleRenderer,
} from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const AboutScams: StepComponent = () => {
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
      <FormWrapper></FormWrapper>
    </>
  );
};
