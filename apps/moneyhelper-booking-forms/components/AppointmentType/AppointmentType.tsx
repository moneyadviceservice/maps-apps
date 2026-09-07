import { useTranslation } from '@maps-digital/shared/hooks';

import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton/QuestionRadioButton';
import { FormWrapper } from '@maps-react/mhf/components';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { JourneyType } from '../../lib/constants';
import { BookingStepComponent } from '../../lib/types';

export const AppointmentType: BookingStepComponent = ({ errors, step }) => {
  const { t, tList } = useTranslation();
  const componentKey = `components.${step}`;
  const componentFormKey = `${componentKey}.form.radio-button`;
  const name = 'flow';
  const options = tList(`${componentFormKey}.options`);
  const error = getFieldError(name, errors)
    ? t(`${componentFormKey}.error`)
    : undefined;

  return (
    <FormWrapper className="lg:max-w-3xl" step={step}>
      {/* Hidden input to ensure that the journey type is always submitted. */}
      <input type="hidden" name="journeyType" value={JourneyType.BASE} />
      <QuestionRadioButton
        options={options}
        name={name}
        error={error}
        hideLabel={true}
        hasErrorWrapper={true}
      >
        {t(`${componentKey}.title`)}
      </QuestionRadioButton>
    </FormWrapper>
  );
};
