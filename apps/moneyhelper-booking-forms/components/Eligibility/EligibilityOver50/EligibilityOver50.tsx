import { OptionTypes } from '@maps-react/mhf/components';

import { BookingStepComponent } from '../../../lib/types';

export const EligibilityOver50: BookingStepComponent = ({ errors, step }) => {
  const formContentKey = 'components.eligibility-over-50.form.radio-button';

  return (
    <OptionTypes
      step={step}
      name="eligibilityOver50Status"
      errors={errors ?? {}}
      optionsContentKey={`${formContentKey}.options`}
      formErrorContentKey={`${formContentKey}.error`}
    />
  );
};
