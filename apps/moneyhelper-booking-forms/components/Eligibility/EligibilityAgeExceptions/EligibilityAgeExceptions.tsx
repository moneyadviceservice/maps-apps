import { OptionTypes } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const EligibilityAgeExceptions: StepComponent = ({
  errors,
  entry,
  step,
}) => {
  const formContentKey =
    'components.eligibility-age-exceptions.form.radio-button';
  const name = 'nextStep';

  return (
    <OptionTypes
      step={step}
      name={name}
      errors={errors ?? {}}
      optionsContentKey={`${formContentKey}.options`}
      formErrorContentKey={`${formContentKey}.error`}
      defaultChecked={entry?.data?.[name] ?? ''}
    />
  );
};
