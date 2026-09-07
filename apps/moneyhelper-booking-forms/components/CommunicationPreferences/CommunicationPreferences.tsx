import { CheckboxGroup } from '@maps-react/form/components/Checkbox';
import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton/QuestionRadioButton';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper } from '@maps-react/mhf/components';
import { asString, asStringArray } from '@maps-react/mhf/utils';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { StepName } from '../../lib/constants';
import { BookingStepComponent } from '../../lib/types';
import { findEncodedOptionValue } from '../../lib/utils';

export const CommunicationPreferences: BookingStepComponent = ({
  step,
  entry,
  errors,
}) => {
  const { t, tList } = useTranslation();
  const componentKey = `components.${StepName.COMMUNICATION_PREFERENCES}.form`;

  const fieldNames = {
    preferredMethodOfCommunication: 'preferredMethodOfCommunication',
    largePrintCommunication: 'largePrintCommunication',
    contactYouCommunication: 'contactYouCommunication',
  } as const;

  const localeFieldKeys = {
    preferredMethodOfCommunication: 'checkbox-preferred-method',
    largePrintCommunication: 'radio-button-large-print',
    contactYouCommunication: 'radio-button-contact-you',
  } as const satisfies Record<keyof typeof fieldNames, string>;

  const fieldErrors = {
    preferredMethodOfCommunication: getFieldError(
      fieldNames.preferredMethodOfCommunication,
      errors,
    ),
    largePrintCommunication: getFieldError(
      fieldNames.largePrintCommunication,
      errors,
    ),
    contactYouCommunication: getFieldError(
      fieldNames.contactYouCommunication,
      errors,
    ),
  };

  const checkboxItems = tList(
    `${componentKey}.${localeFieldKeys.preferredMethodOfCommunication}.items`,
  );
  const checkboxError = fieldErrors.preferredMethodOfCommunication
    ? t(
        `${componentKey}.${localeFieldKeys.preferredMethodOfCommunication}.error`,
      )
    : undefined;

  // Get the selected values for the preferredMethodOfCommunication field, handling both string and array inputs (due to the checkbox group allowing multiple selections - array) and the possibility of a single string value (if only one option is selected).
  const checkboxValues = asStringArray(
    entry?.data?.preferredMethodOfCommunication,
  ).map((value) => findEncodedOptionValue(checkboxItems, value) ?? value);

  return (
    <FormWrapper step={step} nextStep={StepName.CONFIRM_DETAILS}>
      <div className="flex flex-col gap-8">
        <CheckboxGroup
          name={fieldNames.preferredMethodOfCommunication}
          label={t(
            `${componentKey}.${localeFieldKeys.preferredMethodOfCommunication}.label`,
          )}
          hint={t(
            `${componentKey}.${localeFieldKeys.preferredMethodOfCommunication}.hint`,
          )}
          items={checkboxItems}
          error={checkboxError}
          defaultChecked={checkboxError ? [] : checkboxValues}
          hasErrorWrapper
        />
        <QuestionRadioButton
          name={fieldNames.largePrintCommunication}
          options={tList(
            `${componentKey}.${localeFieldKeys.largePrintCommunication}.options`,
          )}
          hint={t(
            `${componentKey}.${localeFieldKeys.largePrintCommunication}.hint`,
          )}
          error={
            fieldErrors.largePrintCommunication
              ? t(
                  `${componentKey}.${localeFieldKeys.largePrintCommunication}.error`,
                )
              : undefined
          }
          defaultChecked={asString(entry?.data?.largePrintCommunication)}
          hasErrorWrapper
        >
          {t(
            `${componentKey}.${localeFieldKeys.largePrintCommunication}.label`,
          )}
        </QuestionRadioButton>
        <QuestionRadioButton
          name={fieldNames.contactYouCommunication}
          hint={t(
            `${componentKey}.${localeFieldKeys.contactYouCommunication}.hint`,
          )}
          options={tList(
            `${componentKey}.${localeFieldKeys.contactYouCommunication}.options`,
          )}
          error={
            fieldErrors.contactYouCommunication
              ? t(
                  `${componentKey}.${localeFieldKeys.contactYouCommunication}.error`,
                )
              : undefined
          }
          defaultChecked={asString(entry?.data?.contactYouCommunication)}
          hasErrorWrapper
        >
          {t(
            `${componentKey}.${localeFieldKeys.contactYouCommunication}.label`,
          )}
        </QuestionRadioButton>
      </div>
    </FormWrapper>
  );
};
