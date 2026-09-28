import { CheckboxGroup } from '@maps-react/form/components/Checkbox';
import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton/QuestionRadioButton';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper } from '@maps-react/mhf/components';
import {
  asString,
  asStringArray,
  findEncodedOptionValue,
} from '@maps-react/mhf/utils';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import {
  FORM_FIELD_CONTENT_KEY,
  FormFieldName,
  StepName,
} from '../../lib/constants';
import { BookingStepComponent } from '../../lib/types';

export const CommunicationPreferences: BookingStepComponent = ({
  step,
  entry,
  errors,
}) => {
  const { t, tList } = useTranslation();
  const contentKey = `components.${step}.form`;

  const communicationMethodItems = tList(
    `${contentKey}.${FORM_FIELD_CONTENT_KEY.communicationMethod}.items`,
  );
  const communicationMethodError = getFieldError(
    FormFieldName.COMMUNICATION_METHOD,
    errors,
  )
    ? t(`${contentKey}.${FORM_FIELD_CONTENT_KEY.communicationMethod}.error`)
    : undefined;

  // Get the selected values for the preferred method of communication checkbox group.
  const checkboxValues = asStringArray(
    entry?.data?.[FormFieldName.COMMUNICATION_METHOD],
  ).map(
    (value) => findEncodedOptionValue(communicationMethodItems, value) ?? value,
  );

  return (
    <FormWrapper step={step} nextStep={StepName.CONFIRM_DETAILS}>
      <div className="flex flex-col gap-8">
        <CheckboxGroup
          name={FormFieldName.COMMUNICATION_METHOD}
          label={t(
            `${contentKey}.${FORM_FIELD_CONTENT_KEY.communicationMethod}.label`,
          )}
          hint={t(
            `${contentKey}.${FORM_FIELD_CONTENT_KEY.communicationMethod}.hint`,
          )}
          items={communicationMethodItems}
          error={communicationMethodError}
          defaultChecked={communicationMethodError ? [] : checkboxValues}
          hasErrorWrapper
        />
        <QuestionRadioButton
          name={FormFieldName.COMMUNICATION_LARGE_PRINT}
          options={tList(
            `${contentKey}.${FORM_FIELD_CONTENT_KEY.communicationLargePrint}.options`,
          )}
          hint={t(
            `${contentKey}.${FORM_FIELD_CONTENT_KEY.communicationLargePrint}.hint`,
          )}
          error={
            getFieldError(FormFieldName.COMMUNICATION_LARGE_PRINT, errors)
              ? t(
                  `${contentKey}.${FORM_FIELD_CONTENT_KEY.communicationLargePrint}.error`,
                )
              : undefined
          }
          defaultChecked={asString(
            entry?.data?.[FormFieldName.COMMUNICATION_LARGE_PRINT],
          )}
          hasErrorWrapper
        >
          {t(
            `${contentKey}.${FORM_FIELD_CONTENT_KEY.communicationLargePrint}.label`,
          )}
        </QuestionRadioButton>
        <QuestionRadioButton
          name={FormFieldName.COMMUNICATION_CONTACT_YOU}
          hint={t(
            `${contentKey}.${FORM_FIELD_CONTENT_KEY.communicationContactYou}.hint`,
          )}
          options={tList(
            `${contentKey}.${FORM_FIELD_CONTENT_KEY.communicationContactYou}.options`,
          )}
          error={
            getFieldError(FormFieldName.COMMUNICATION_CONTACT_YOU, errors)
              ? t(
                  `${contentKey}.${FORM_FIELD_CONTENT_KEY.communicationContactYou}.error`,
                )
              : undefined
          }
          defaultChecked={asString(
            entry?.data?.[FormFieldName.COMMUNICATION_CONTACT_YOU],
          )}
          hasErrorWrapper
        >
          {t(
            `${contentKey}.${FORM_FIELD_CONTENT_KEY.communicationContactYou}.label`,
          )}
        </QuestionRadioButton>
      </div>
    </FormWrapper>
  );
};
