import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';
import useTranslation from '@maps-react/hooks/useTranslation';
import { FormWrapper, SubTitleRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';
import { asString } from '@maps-react/mhf/utils/entryValueHelpers';
import { findEncodedOptionValue } from '@maps-react/mhf/utils/findEncodedOptionValue';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import {
  FORM_BASE_PATH,
  FORM_FIELD_CONTENT_KEY,
  FormFieldName,
} from '../../constants';

export const HealthConditions: StepComponent = ({ errors, step, entry }) => {
  const { t, tList } = useTranslation();
  const contentKey = `${FORM_BASE_PATH}/components.${step}`;
  const formContentKey = `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.healthConditions}`;
  const healthConditionOptions = tList(`${formContentKey}.options`);

  return (
    <>
      <SubTitleRenderer
        content={t(`${contentKey}.sub-title`)}
        testId={`${step}-sub-title`}
      />
      <FormWrapper step={step}>
        <QuestionRadioButton
          options={healthConditionOptions}
          name={FormFieldName.HEALTH_CONDITIONS}
          error={
            getFieldError(FormFieldName.HEALTH_CONDITIONS, errors)
              ? t(`${formContentKey}.error`)
              : undefined
          }
          hideLabel={true}
          hasErrorWrapper={true}
          defaultChecked={findEncodedOptionValue(
            healthConditionOptions,
            asString(entry?.data?.[FormFieldName.HEALTH_CONDITIONS]),
          )}
        >
          {t(`${formContentKey}.label`)}
        </QuestionRadioButton>
      </FormWrapper>
    </>
  );
};
