import type { SubmitEventHandler } from 'react';

import { useTranslation } from '@maps-digital/shared/hooks';

import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton/QuestionRadioButton';
import { FormWrapper } from '@maps-react/mhf/components';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { FlowName, JourneyType } from '../../lib/constants';
import { BookingStepComponent } from '../../lib/types';

export const AppointmentType: BookingStepComponent = ({ errors, step }) => {
  const { t, tList } = useTranslation();
  const name = 'flow';
  const contentKey = `components.${step}`;
  const formContentKey = `${contentKey}.form.flow`;
  const options = tList(`${formContentKey}.options`);
  const onSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    const formData = new FormData(event.currentTarget);
    if (formData.get(name) !== FlowName.PENSION_WISE) return;

    event.preventDefault();
    window.location.assign(t(`${contentKey}.link`));
  };

  return (
    <FormWrapper className="lg:max-w-3xl" step={step} onSubmit={onSubmit}>
      {/* Hidden input to ensure that the journey type is always submitted. */}
      <input type="hidden" name="journeyType" value={JourneyType.BASE} />
      <QuestionRadioButton
        options={options}
        name={name}
        error={
          getFieldError(name, errors) ? t(`${formContentKey}.error`) : undefined
        }
        hideLabel={true}
        hasErrorWrapper={true}
      >
        {t(`${contentKey}.title`)}
      </QuestionRadioButton>
    </FormWrapper>
  );
};
