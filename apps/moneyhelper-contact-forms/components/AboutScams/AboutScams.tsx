import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';
import { FormWrapper } from '../FormWrapper';

export const AboutScams: StepComponent = ({ step }) => {
  const { t } = useTranslation();

  return (
    <>
      <Paragraph className="mb-4">
        {t('components.about-scams.content')}
      </Paragraph>
      <FormWrapper step={step}></FormWrapper>
    </>
  );
};
