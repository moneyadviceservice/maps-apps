import { OptionTypes } from '@maps-react/mhf/components';

import { BookingStepComponent } from '../../../lib/types';

export const EligibilityAgeExceptions: BookingStepComponent = ({
  errors,
  step,
}) => {
  const formContentKey =
    'components.eligibility-age-exceptions.form.radio-button';
  const name = 'eligibilityAgeExceptionType';

  return (
    <OptionTypes
      step={step}
      name={name}
      errors={errors ?? {}}
      optionsContentKey={`${formContentKey}.options`}
      formErrorContentKey={`${formContentKey}.error`}
    />
  );
};
