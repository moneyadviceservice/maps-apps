import { ExpandableSection } from '@maps-digital/shared/ui';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import {
  FormWrapper,
  SectionsRenderer,
  SubTitleRenderer,
} from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const AboutPensionWise: StepComponent = () => {
  const { t, tList } = useTranslation();
  const sections = tList('components.about-pension-wise.sections');

  return (
    <>
      <div className="flex flex-col gap-4">
        <SubTitleRenderer
          content={t('components.about-pension-wise.sub-title')}
          testId="about-pension-wise-sub-title"
        />
        <SectionsRenderer
          sections={sections}
          testIdPrefix="about-pension-wise"
        />
        <ExpandableSection
          title={t('components.about-pension-wise.expandable-section.title')}
        >
          <Paragraph>
            {t('components.about-pension-wise.expandable-section.content')}
          </Paragraph>
        </ExpandableSection>
      </div>
      <FormWrapper></FormWrapper>
    </>
  );
};
