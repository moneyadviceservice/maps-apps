import useTranslation from '@maps-react/hooks/useTranslation';
import {
  FormWrapper,
  SectionsRenderer,
  SubTitleRenderer,
} from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const AboutPensionDivorce: StepComponent = () => {
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
      <FormWrapper></FormWrapper>
    </div>
  );
};
