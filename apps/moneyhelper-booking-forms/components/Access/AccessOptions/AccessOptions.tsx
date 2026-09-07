import { useState } from 'react';

import { ExpandableSection } from '@maps-digital/shared/ui';

import { CheckboxGroup } from '@maps-react/form/components/Checkbox';
import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';
import { TextArea } from '@maps-react/form/components/TextArea';
import { TextInput } from '@maps-react/form/components/TextInput/TextInput';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper } from '@maps-react/mhf/components';
import { asString } from '@maps-react/mhf/utils';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { StepName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';
import { findEncodedOptionValue } from '../../../lib/utils';

export const AccessOptions: BookingStepComponent = ({
  errors,
  entry,
  step,
}) => {
  const { t, tList } = useTranslation();
  const componentKey = `components.${StepName.ACCESS_OPTIONS}`;

  const radioButtonName = 'accessOptionsRequest';
  const checkboxName = 'accessOptionsCompanion';
  const textInputName = 'accessOptionsCompanionName';
  const textAreaName = 'accessOptionsDetails';
  const options = tList(`${componentKey}.form.radio-button.options`);

  const radioButtonError = getFieldError(radioButtonName, errors)
    ? t(`${componentKey}.form.radio-button.error`)
    : undefined;

  const [checkboxSelected, setCheckboxSelected] = useState(
    asString(entry?.data?.[checkboxName]) !== '',
  );

  return (
    <FormWrapper
      className="lg:max-w-3xl"
      step={step}
      nextStep={StepName.PRE_APPOINTMENT}
    >
      {/* Hidden input to ensure that the checkbox value is always submitted, even when unchecked. This is necessary because unchecked checkboxes do not send any value in the form submission. */}
      {!checkboxSelected && (
        <input type="hidden" name={checkboxName} value="" />
      )}
      <div className="flex flex-col gap-8">
        <QuestionRadioButton
          options={options}
          name={radioButtonName}
          error={radioButtonError}
          hideLabel={true}
          hasErrorWrapper={true}
          defaultChecked={findEncodedOptionValue(
            options,
            asString(entry?.data?.[radioButtonName]),
          )}
        >
          {t(`${componentKey}.title`)}
        </QuestionRadioButton>

        <CheckboxGroup
          label={t(`${componentKey}.form.companion-checkbox.label`)}
          hideLabel
          name={checkboxName}
          items={[
            {
              value: t(`${componentKey}.form.companion-checkbox.value`),
              label: t(`${componentKey}.form.companion-checkbox.label`),
            },
          ]}
          defaultChecked={[asString(entry?.data?.[checkboxName])]}
          onChange={(e) => setCheckboxSelected(e.target.checked)}
        />
        {checkboxSelected && (
          <div className="pl-5 ml-6 border-l-4 border-gray-250">
            <TextInput
              id={textInputName}
              name={textInputName}
              type="text"
              label={t(`${componentKey}.form.companion-name.label`)}
              hint={t(`${componentKey}.form.companion-name.hint`)}
              data-testid="input-access-companion-name"
              defaultValue={asString(entry?.data?.[textInputName])}
            />
            <ExpandableSection
              title={t(`${componentKey}.form.companion-name.accordion.title`)}
            >
              {t(`${componentKey}.form.companion-name.accordion.content`)}
            </ExpandableSection>
          </div>
        )}
        <div>
          <TextArea
            id={textAreaName}
            name={textAreaName}
            label={t(`${componentKey}.form.additional-details.label`)}
            minLength={50}
            maxLength={4000}
            hasCharacterCounter
            defaultValue={asString(entry?.data?.[textAreaName])}
            hasGlassBoxClass={true}
            hint={t(`${componentKey}.form.additional-details.hint`)}
          />
        </div>
      </div>
    </FormWrapper>
  );
};
