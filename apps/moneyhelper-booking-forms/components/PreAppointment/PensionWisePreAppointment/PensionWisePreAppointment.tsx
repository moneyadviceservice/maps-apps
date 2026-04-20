import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper, SectionsRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const PensionWisePreAppointment: StepComponent = ({ step }) => {
  const { tList } = useTranslation();
  const sections = tList('components.pension-wise-pre-appointment.sections');

  return (
    <>
      <div className="flex flex-col gap-4">
        <SectionsRenderer
          sections={sections}
          testIdPrefix="pension-wise-pre-appointment"
        />
      </div>
      <FormWrapper step={step}></FormWrapper>
    </>
  );
};
