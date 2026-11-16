import { useState } from 'react';

import { Select } from '@maps-react/form/components/Select';
import { TextInput } from '@maps-react/form/components/TextInput';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper, SectionsRenderer } from '@maps-react/mhf/components';
import { asString } from '@maps-react/mhf/utils';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import {
  FORM_FIELD_CONTENT_KEY,
  FormFieldName,
  StepName,
} from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const AccessLanguage: BookingStepComponent = ({
  errors,
  entry,
  step,
}) => {
  const { t, tList } = useTranslation();
  const contentKey = `components.${step}`;

  const [selectedLanguage, setSelectedLanguage] = useState(
    entry?.data?.[FormFieldName.ACCESS_SUPPORT_LANGUAGE_TYPE] ?? '',
  );

  const options = tList(
    `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportLanguageType}.options`,
  );

  const accessLanguageError = getFieldError(
    FormFieldName.ACCESS_SUPPORT_LANGUAGE_TYPE,
    errors,
  )
    ? t(
        `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportLanguageType}.error`,
      )
    : undefined;

  return (
    <>
      <SectionsRenderer
        sections={tList(`${contentKey}.sections`)}
        testIdPrefix={step}
      />
      <FormWrapper
        className="lg:max-w-md"
        step={step}
        nextStep={StepName.PRE_APPOINTMENT}
      >
        <Select
          emptyItemText="Please choose an item"
          hasError={!!accessLanguageError}
          name={FormFieldName.ACCESS_SUPPORT_LANGUAGE_TYPE}
          options={options}
          error={accessLanguageError}
          defaultValue={asString(
            entry?.data?.[FormFieldName.ACCESS_SUPPORT_LANGUAGE_TYPE],
          )}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          hasErrorWrapper={true}
        />
        {selectedLanguage === 'other' && (
          <div className="mt-8">
            <TextInput
              id={FormFieldName.ACCESS_SUPPORT_LANGUAGE_OTHER}
              name={FormFieldName.ACCESS_SUPPORT_LANGUAGE_OTHER}
              type="text"
              label={t(
                `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportLanguageOther}.label`,
              )}
              data-testid={`input-${FORM_FIELD_CONTENT_KEY.accessSupportLanguageOther}`}
              error={
                getFieldError(
                  FormFieldName.ACCESS_SUPPORT_LANGUAGE_OTHER,
                  errors,
                )
                  ? t(
                      `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.accessSupportLanguageOther}.error`,
                    )
                  : undefined
              }
              defaultValue={asString(
                entry?.data?.[FormFieldName.ACCESS_SUPPORT_LANGUAGE_OTHER],
              )}
              hasErrorWrapper={true}
            />
          </div>
        )}
      </FormWrapper>
    </>
  );
};
