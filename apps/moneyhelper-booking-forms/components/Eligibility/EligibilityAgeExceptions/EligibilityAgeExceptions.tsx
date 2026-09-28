import { OptionTypes } from '@maps-react/mhf/components';

import { FormFieldName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const EligibilityAgeExceptions: BookingStepComponent = ({
  errors,
  step,
}) => {
  const contentKey = `components.${step}.form.radio-button`;

  return (
    <OptionTypes
      step={step}
      name={FormFieldName.ELIGIBILITY_AGE_EXCEPTION_TYPE}
      errors={errors ?? {}}
      optionsContentKey={`${contentKey}.options`}
      formErrorContentKey={`${contentKey}.error`}
    />
  );
};
