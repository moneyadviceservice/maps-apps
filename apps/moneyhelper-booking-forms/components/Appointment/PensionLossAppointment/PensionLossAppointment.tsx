import { FormWrapper } from '@maps-react/mhf/components';

import { ExistingAppointmentCallout } from '../../../components';
import { StepName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';
import { AppointmentContent } from '../AppointmentContent';

export const PensionLossAppointment: BookingStepComponent = ({ step }) => {
  return (
    <>
      <AppointmentContent step={step} />
      <FormWrapper
        step={step}
        nextStep={StepName.ELIGIBILITY_PENSION_LOSS}
      ></FormWrapper>
      <ExistingAppointmentCallout step={step} />
    </>
  );
};
