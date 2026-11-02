import { FormWrapper } from '@maps-react/mhf/components';

import { StepName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';
import { AppointmentContent } from '../AppointmentContent';

export const DivorceAppointment: BookingStepComponent = ({ step }) => {
  return (
    <>
      <AppointmentContent step={step} />
      <FormWrapper
        step={step}
        nextStep={StepName.ELIGIBILITY_FINANCIAL_SETTLEMENT}
      ></FormWrapper>
    </>
  );
};
