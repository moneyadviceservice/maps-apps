import { Heading } from '@maps-digital/shared/ui';

import useTranslation from '@maps-react/hooks/useTranslation';
import { OptionTypes } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

import { FORM_FIELD_CONTENT_KEY, FormFieldName } from '../../lib/constants';
import { AppointmentSummaryCallout } from '../AppointmentSummaryCallout';

export const AppointmentFound: StepComponent = ({ step, entry, errors }) => {
  const { t } = useTranslation();
  const contentKey = `components.${step}`;
  const formContentKey = `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.appointmentFoundAction}`;

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <AppointmentSummaryCallout
        stepName={step}
        entry={entry}
        headingComponent="h1"
      />
      <div>
        <Heading level="h2" data-testid={`${step}-form--title`}>
          {t(`${contentKey}.title`)}
        </Heading>
        <OptionTypes
          step={step}
          name={FormFieldName.APPOINTMENT_FOUND_ACTION}
          errors={errors ?? {}}
          optionsContentKey={`${formContentKey}.options`}
          formErrorContentKey={`${formContentKey}.error`}
        />
      </div>
    </div>
  );
};
