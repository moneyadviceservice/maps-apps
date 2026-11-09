import { OptionTypes } from '@maps-react/mhf/components';

import { FORM_FIELD_CONTENT_KEY, FormFieldName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const EligibilityOver50: BookingStepComponent = ({ errors, step }) => {
  const formContentKey = `components.${step}.form.${FORM_FIELD_CONTENT_KEY.eligibilityOver50Status}`;

  return (
    <OptionTypes
      step={step}
      name={FormFieldName.ELIGIBILITY_OVER_50_STATUS}
      errors={errors ?? {}}
      optionsContentKey={`${formContentKey}.options`}
      formErrorContentKey={`${formContentKey}.error`}
    />
  );
};
