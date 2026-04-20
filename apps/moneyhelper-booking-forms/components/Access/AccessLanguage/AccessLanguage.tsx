import { Errors, ErrorType } from '@maps-react/common/components/Errors/Errors';
import { Select } from '@maps-react/form/components/Select';
import { TextInput } from '@maps-react/form/components/TextInput';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper, SectionsRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { getPreAppointmentStep } from '../../../lib/utils';

export const AccessLanguage: StepComponent = ({ errors, entry }) => {
  const { t, tList } = useTranslation();
  const contentKey = 'components.access-language';

  const selectName = 'accessLanguageType';
  const textInputName = 'accessLanguageOther';

  const nextStep = getPreAppointmentStep(entry);

  const options = tList(`${contentKey}.form.language-type.options`);

  const selectError = getFieldError(selectName, errors)
    ? t(`${contentKey}.form.language-type.error`)
    : undefined;

  const textInputError = getFieldError(textInputName, errors)
    ? t(`${contentKey}.form.language-other.error`)
    : undefined;

  return (
    <>
      <SectionsRenderer
        sections={tList(`${contentKey}.sections`)}
        testIdPrefix="access-language"
      />
      <FormWrapper className="lg:max-w-md" nextStep={nextStep}>
        <Errors errors={selectError ? [{} as ErrorType] : []}>
          <Select
            emptyItemText="Please choose an item"
            hasError={!!selectError}
            name={selectName}
            options={options}
            defaultValue={entry?.data[selectName] ?? ''}
          />
        </Errors>
        <div className="mt-8">
          <Errors errors={textInputError ? [{} as ErrorType] : []}>
            <TextInput
              id={textInputName}
              name={textInputName}
              type="text"
              label={t(`${contentKey}.form.language-other.label`)}
              data-testid="input-access-language-other"
              error={textInputError}
              defaultValue={entry?.data?.[textInputName] ?? ''}
            />
          </Errors>
        </div>
      </FormWrapper>
    </>
  );
};
