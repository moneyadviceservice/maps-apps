import { useState } from 'react';

import { Errors, ExpandableSection, Paragraph } from '@maps-digital/shared/ui';

import { CheckboxGroup } from '@maps-react/form/components/Checkbox';
import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';
import { TextArea } from '@maps-react/form/components/TextArea';
import { TextInput } from '@maps-react/form/components/TextInput/TextInput';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper } from '@maps-react/mhf/components';
import { asString, findEncodedOptionValue } from '@maps-react/mhf/utils';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import {
  FORM_FIELD_CONTENT_KEY,
  FormFieldName,
  StepName,
} from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const AccessOptions: BookingStepComponent = ({
  errors,
  entry,
  step,
}) => {
  const { t, tList } = useTranslation();
  const contentKey = `components.${step}`;
  const options = tList(
    `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportRequest}.options`,
  );
  const optionsAdditional = tList(
    `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportRequest}.conditional-options`,
  );

  const radioButtonError = getFieldError(
    FormFieldName.ACCESS_SUPPORT_REQUEST,
    errors,
  )
    ? t(
        `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportRequest}.error`,
      )
    : undefined;
  const checkboxError = getFieldError(
    FormFieldName.ACCESS_SUPPORT_COMPANION,
    errors,
  )
    ? t(
        `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportCompanion}.error`,
      )
    : undefined;
  const textAreaError = getFieldError(
    FormFieldName.ACCESS_SUPPORT_DETAILS,
    errors,
  )
    ? t(
        `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportDetails}.error`,
      )
    : undefined;

  const [checkboxSelected, setCheckboxSelected] = useState(
    asString(entry?.data?.[FormFieldName.ACCESS_SUPPORT_COMPANION]) !== '',
  );

  return (
    <FormWrapper
      className="lg:max-w-3xl"
      step={step}
      nextStep={StepName.PRE_APPOINTMENT}
    >
      {/* Hidden input to ensure that the checkbox value is always submitted, even when unchecked. This is necessary because unchecked checkboxes do not send any value in the form submission. */}
      {!checkboxSelected && (
        <input
          type="hidden"
          name={FormFieldName.ACCESS_SUPPORT_COMPANION}
          value=""
        />
      )}
      <div className="flex flex-col gap-8">
        <Errors errors={radioButtonError ? [radioButtonError] : []}>
          <QuestionRadioButton
            options={options}
            error={radioButtonError}
            hideLabel={true}
            name={FormFieldName.ACCESS_SUPPORT_REQUEST}
            hasErrorWrapper={false}
            defaultChecked={findEncodedOptionValue(
              options,
              asString(entry?.data?.[FormFieldName.ACCESS_SUPPORT_REQUEST]),
            )}
            idPrefix="primary"
          >
            {t(`${contentKey}.title`)}
          </QuestionRadioButton>
          <Paragraph className="pl-2 my-6">
            {t(
              `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportRequest}.conditional-text`,
            )}
          </Paragraph>
          <QuestionRadioButton
            options={optionsAdditional}
            name={FormFieldName.ACCESS_SUPPORT_REQUEST}
            hideLabel={true}
            defaultChecked={findEncodedOptionValue(
              optionsAdditional,
              asString(entry?.data?.[FormFieldName.ACCESS_SUPPORT_REQUEST]),
            )}
            idPrefix="additional"
          >
            {t(`${contentKey}.title`)}
          </QuestionRadioButton>
        </Errors>
        <Errors
          className="flex flex-col gap-8"
          errors={checkboxError ? [checkboxError] : []}
        >
          <CheckboxGroup
            label={t(
              `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportCompanion}.label`,
            )}
            hideLabel
            name={FormFieldName.ACCESS_SUPPORT_COMPANION}
            items={[
              {
                value: t(
                  `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportCompanion}.value`,
                ),
                label: t(
                  `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportCompanion}.label`,
                ),
              },
            ]}
            defaultChecked={[
              asString(entry?.data?.[FormFieldName.ACCESS_SUPPORT_COMPANION]),
            ]}
            onChange={(e) => setCheckboxSelected(e.target.checked)}
            error={checkboxError}
          />
          {checkboxSelected && (
            <div className="pl-5 ml-6 border-l-4 border-gray-250">
              <TextInput
                id={FormFieldName.ACCESS_SUPPORT_COMPANION_NAME}
                name={FormFieldName.ACCESS_SUPPORT_COMPANION_NAME}
                type="text"
                label={t(
                  `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportCompanionName}.label`,
                )}
                hint={t(
                  `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportCompanionName}.hint`,
                )}
                data-testid="input-access-companion-name"
                defaultValue={asString(
                  entry?.data?.[FormFieldName.ACCESS_SUPPORT_COMPANION_NAME],
                )}
              />
              <ExpandableSection
                title={t(
                  `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportCompanionName}.accordion.title`,
                )}
              >
                {t(
                  `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportCompanionName}.accordion.content`,
                )}
              </ExpandableSection>
            </div>
          )}
          <div>
            <TextArea
              id={FormFieldName.ACCESS_SUPPORT_DETAILS}
              name={FormFieldName.ACCESS_SUPPORT_DETAILS}
              label={t(
                `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportDetails}.label`,
              )}
              minLength={50}
              maxLength={4000}
              hasCharacterCounter
              defaultValue={asString(
                entry?.data?.[FormFieldName.ACCESS_SUPPORT_DETAILS],
              )}
              hasGlassBoxClass={true}
              hint={t(
                `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportDetails}.hint`,
              )}
              error={textAreaError}
            />
          </div>
        </Errors>
      </div>
    </FormWrapper>
  );
};
