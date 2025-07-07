import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';
import { FormWrapper } from '../FormWrapper';

export const AboutMHPD: StepComponent = ({ step }) => {
  const { t } = useTranslation();

  return (
    <>
      <Paragraph className="mb-4" data-testid="about-mhpd-content">
        {t('components.about-mhpd.content')}
      </Paragraph>
      <FormWrapper step={step}></FormWrapper>
    </>
  );
};
