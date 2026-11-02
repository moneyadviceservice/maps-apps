import { useTranslation } from '@maps-react/hooks/useTranslation';
import { OptionTypes } from '@maps-react/mhf/components';
import { SectionsRenderer } from '@maps-react/mhf/components/SectionsRenderer/SectionsRenderer';

import {
  FORM_FIELD_CONTENT_KEY,
  FormFieldName,
  StepName,
} from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const PensionWiseDigitalAppointment: BookingStepComponent = ({
  errors,
  step,
}) => {
  const { tList } = useTranslation();
  const contentKey = `components.${step}`;
  const formContentKey = `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.pensionWiseDigitalAppointmentStatus}`;
  const sections = tList(`${contentKey}.sections`);

  return (
    <>
      <SectionsRenderer sections={sections} testIdPrefix={step} />
      <OptionTypes
        step={step}
        name={FormFieldName.PENSION_WISE_DIGITAL_APPOINTMENT_STATUS}
        errors={errors ?? {}}
        optionsContentKey={`${formContentKey}.options`}
        formErrorContentKey={`${formContentKey}.error`}
        nextStep={StepName.COMMUNICATION_PREFERENCES}
      />
    </>
  );
};
