import { FormWrapper } from '@maps-react/mhf/components';

import { StepName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';
import { AppointmentContent } from '../AppointmentContent';

export const PensionWiseAppointment: BookingStepComponent = ({ step }) => {
  return (
    <>
      <AppointmentContent step={step} />
      <FormWrapper
        step={step}
        nextStep={StepName.ELIGIBILITY_DEFINED_CONTRIBUTION}
      ></FormWrapper>
    </>
  );
};
