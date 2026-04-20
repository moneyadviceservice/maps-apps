import {
  QuestionOption,
  QuestionRadioButton,
} from '@maps-react/form/components/QuestionRadioButton';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper, SectionsRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { FLOW_PRE_APPOINTMENT_TOKEN } from '../../../lib/constants';
import { getPreAppointmentStep } from '../../../lib/utils';

/**
 * In this component we are asking the user if they require access support for their appointment.
 * If they select 'Yes' they will be taken to into the common access needs section.
 * If they select 'No' they will be taken to a pre-appointment step which is determined by their flow.
 * We use a placeholder value (FLOW_PRE_APPOINTMENT_TOKEN) in the options (from en/cy.json) which is then replaced with the actual pre-appointment step value at runtime. This is because the value of the 'No' option is dynamic and depends on the user's flow, which we only have access to at runtime.
 */
export const AccessSupport: StepComponent = ({ errors, step, entry }) => {
  const { t, tList } = useTranslation();
  const componentKey = 'components.access-support';
  const sections = tList(`${componentKey}.sections`);
  const formContentKey = `${componentKey}.form.radio-button`;
  const fieldName = 'nextStep';

  const defaultOptions = tList(`${formContentKey}.options`) as QuestionOption[];
  const preAppointmentStep = getPreAppointmentStep(entry);

  // Replace the placeholder value in the options with the actual pre-appointment step value
  const options = defaultOptions.map((option) =>
    option.value === FLOW_PRE_APPOINTMENT_TOKEN
      ? { ...option, value: preAppointmentStep }
      : option,
  );

  const error = getFieldError(fieldName, errors)
    ? t(`${formContentKey}.error`)
    : undefined;

  return (
    <>
      <SectionsRenderer sections={sections} testIdPrefix="access-support" />
      <FormWrapper className="lg:max-w-3xl">
        <QuestionRadioButton
          options={options}
          name={fieldName}
          error={error}
          hasErrorWrapper={true}
          hideLabel={true}
        >
          {t(`components.${step}.title`)}
        </QuestionRadioButton>
      </FormWrapper>
    </>
  );
};
