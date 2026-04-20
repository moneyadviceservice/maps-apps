import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';
import { TextArea } from '@maps-react/form/components/TextArea';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

export const AccessOptions: StepComponent = ({ errors, entry }) => {
  const { t, tList } = useTranslation();
  const componentKey = 'components.access-options';

  const textAreaName = 'accessOptionsDetails';
  const radioButtonName = 'nextStep';
  const options = tList(`${componentKey}.form.radio-button.options`);
  const radioButtonError = getFieldError(radioButtonName, errors)
    ? t(`${componentKey}.form.radio-button.error`)
    : undefined;

  return (
    <FormWrapper className="lg:max-w-3xl">
      <QuestionRadioButton
        className="mb-16"
        options={options}
        name={radioButtonName}
        error={radioButtonError}
        hideLabel={true}
        hasErrorWrapper={true}
      >
        {t(`${componentKey}.title`)}
      </QuestionRadioButton>

      <TextArea
        id={textAreaName}
        name={textAreaName}
        label={t(`${componentKey}.form.text-area.label`)}
        minLength={50}
        maxLength={4000}
        hasCharacterCounter
        defaultValue={entry?.data?.[textAreaName] ?? ''}
        hasGlassBoxClass={true}
        hint={t(`${componentKey}.form.text-area.hint`)}
      />
    </FormWrapper>
  );
};
