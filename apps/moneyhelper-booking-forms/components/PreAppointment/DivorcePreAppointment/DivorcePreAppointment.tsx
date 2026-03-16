import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper, SectionsRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const DivorcePreAppointment: StepComponent = ({ step }) => {
  const { tList } = useTranslation();
  const sections = tList('components.divorce-pre-appointment.sections');

  return (
    <>
      <div className="flex flex-col gap-4">
        <SectionsRenderer
          sections={sections}
          testIdPrefix="divorce-pre-appointment"
        />
      </div>
      <FormWrapper step={step}></FormWrapper>
    </>
  );
};
