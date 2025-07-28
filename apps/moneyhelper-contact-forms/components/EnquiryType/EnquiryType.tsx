import { StepComponent } from '../../lib/types';
import { OptionTypes } from '../OptionTypes';

export const EnquiryType: StepComponent = ({ errors, step }) => {
  const formContentKey = 'components.enquiry-type.form.flow';

  return (
    <OptionTypes
      errors={errors}
      step={step}
      optionsContentKey={`${formContentKey}.options`}
      formErrorContentKey={`${formContentKey}.error`}
    />
  );
};
