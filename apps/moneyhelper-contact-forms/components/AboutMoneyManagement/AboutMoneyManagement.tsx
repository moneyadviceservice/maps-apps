import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';
import { FormWrapper } from '../FormWrapper';

export const AboutMoneyManagement: StepComponent = ({ step }) => {
  const { t } = useTranslation();

  return (
    <>
      <Paragraph className="mb-4" data-testid="about-money-management-content">
        {t('components.about-money-management.content')}
      </Paragraph>
      <FormWrapper step={step}></FormWrapper>
    </>
  );
};
