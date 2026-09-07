import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper, SectionsRenderer } from '@maps-react/mhf/components';

import { StepName } from '../../lib/constants';
import { BookingStepComponent } from '../../lib/types';

export const PreAppointment: BookingStepComponent = ({ entry, step, flow }) => {
  const { tList } = useTranslation();
  const sections = tList(
    `components.${StepName.PRE_APPOINTMENT}.${flow}.sections`,
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <SectionsRenderer
          sections={sections}
          testIdPrefix={StepName.PRE_APPOINTMENT}
        />
      </div>
      <FormWrapper
        step={step}
        nextStep={StepName.APPOINTMENT_DATE_TIME}
      ></FormWrapper>
    </>
  );
};
