import { useTranslation } from '@maps-digital/shared/hooks';

import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';
import { FormWrapper, SubTitleRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';
import { asString } from '@maps-react/mhf/utils/entryValueHelpers';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import {
  FORM_BASE_PATH,
  FORM_FIELD_CONTENT_KEY,
  FormFieldName,
  StepName,
} from '../../constants';

export const HealthConditionsImpact: StepComponent = ({
  step,
  errors,
  entry,
}) => {
  const { t, tList } = useTranslation();
  const contentKey = `${FORM_BASE_PATH}/components.${step}`;
  const formContentKey = `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.healthConditionsImpact}`;
  const decisionOptions = tList(`${formContentKey}.options`);

  return (
    <>
      <SubTitleRenderer
        content={t(`${contentKey}.sub-title`)}
        testId={`${step}-sub-title`}
      />
      <FormWrapper step={step} nextStep={StepName.SUBMIT}>
        <QuestionRadioButton
          options={decisionOptions}
          name={FormFieldName.HEALTH_CONDITIONS_IMPACT}
          error={
            getFieldError(FormFieldName.HEALTH_CONDITIONS_IMPACT, errors)
              ? t(`${formContentKey}.error`)
              : undefined
          }
          hideLabel={true}
          hasErrorWrapper={true}
          defaultChecked={asString(
            entry?.data?.[FormFieldName.HEALTH_CONDITIONS_IMPACT],
          )}
        >
          {t(`${formContentKey}.label`)}
        </QuestionRadioButton>
      </FormWrapper>
    </>
  );
};
