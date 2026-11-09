import { Paragraph } from '@maps-react/common/components/Paragraph/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { FormWrapper } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

import { FORM_BASE_PATH, StepName } from '../../constants';

export const Submit: StepComponent = ({ step }) => {
  const { t } = useTranslation();
  const contentKey = `${FORM_BASE_PATH}/components.${step}`;

  return (
    <FormWrapper
      step={step}
      nextStep={StepName.LOADING}
      className="pt-0 md:pt-0"
    >
      <Paragraph testId={`${step}-content`}>
        {t(`${contentKey}.content`)}
      </Paragraph>
    </FormWrapper>
  );
};
