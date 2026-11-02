import { Errors, Paragraph } from '@maps-digital/shared/ui';

import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';
import useTranslation from '@maps-react/hooks/useTranslation';
import { FormWrapper } from '@maps-react/mhf/components';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { FORM_FIELD_CONTENT_KEY, FormFieldName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const EligibilityAgeExceptions: BookingStepComponent = ({
  errors,
  step,
}) => {
  const { t, tList } = useTranslation();
  const contentKey = `components.${step}`;
  const formContentKey = `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.eligibilityAgeExceptionType}`;
  const options = tList(`${formContentKey}.options`);
  const optionsAdditional = tList(`${formContentKey}.conditional-options`);
  const radioButtonError = getFieldError(
    FormFieldName.ELIGIBILITY_AGE_EXCEPTION_TYPE,
    errors,
  )
    ? t(
        `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.eligibilityAgeExceptionType}.error`,
      )
    : undefined;

  return (
    <FormWrapper className="lg:max-w-3xl" step={step}>
      <div className="flex flex-col gap-8">
        <Errors errors={radioButtonError ? [radioButtonError] : []}>
          <QuestionRadioButton
            options={options}
            error={radioButtonError}
            hideLabel={true}
            name={FormFieldName.ELIGIBILITY_AGE_EXCEPTION_TYPE}
            hasErrorWrapper={false}
            idPrefix="primary"
          >
            {t(`${contentKey}.title`)}
          </QuestionRadioButton>
          <Paragraph className="pl-2 my-6">
            {t(
              `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.eligibilityAgeExceptionType}.conditional-text`,
            )}
          </Paragraph>
          <QuestionRadioButton
            options={optionsAdditional}
            name={FormFieldName.ELIGIBILITY_AGE_EXCEPTION_TYPE}
            hideLabel={true}
            idPrefix="additional"
          >
            {t(`${contentKey}.title`)}
          </QuestionRadioButton>
        </Errors>
      </div>
    </FormWrapper>
  );
};
