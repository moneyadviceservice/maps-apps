import { useState } from 'react';

import { Select } from '@maps-react/form/components/Select';
import { TextInput } from '@maps-react/form/components/TextInput';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper, SectionsRenderer } from '@maps-react/mhf/components';
import { asString } from '@maps-react/mhf/utils';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { StepName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const AccessLanguage: BookingStepComponent = ({
  errors,
  entry,
  step,
}) => {
  const { t, tList } = useTranslation();
  const contentKey = `components.${StepName.ACCESS_LANGUAGE}`;
  const selectName = 'accessLanguageType';
  const textInputName = 'accessLanguageOther';

  const [selectedLanguage, setSelectedLanguage] = useState(
    entry?.data?.[selectName] ?? '',
  );

  const options = tList(`${contentKey}.form.select.options`);

  const selectError = getFieldError(selectName, errors)
    ? t(`${contentKey}.form.select.error`)
    : undefined;

  const textInputError = getFieldError(textInputName, errors)
    ? t(`${contentKey}.form.language-other.error`)
    : undefined;

  return (
    <>
      <SectionsRenderer
        sections={tList(`${contentKey}.sections`)}
        testIdPrefix={StepName.ACCESS_LANGUAGE}
      />
      <FormWrapper
        className="lg:max-w-md"
        step={step}
        nextStep={StepName.PRE_APPOINTMENT}
      >
        <Select
          emptyItemText="Please choose an item"
          hasError={!!selectError}
          name={selectName}
          options={options}
          error={selectError}
          defaultValue={asString(entry?.data?.[selectName])}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          hasErrorWrapper={true}
        />
        {selectedLanguage === 'other' && (
          <div className="mt-8">
            <TextInput
              id={textInputName}
              name={textInputName}
              type="text"
              label={t(`${contentKey}.form.language-other.label`)}
              data-testid="input-access-language-other"
              error={textInputError}
              defaultValue={asString(entry?.data?.[textInputName])}
              hasErrorWrapper={true}
            />
          </div>
        )}
      </FormWrapper>
    </>
  );
};
