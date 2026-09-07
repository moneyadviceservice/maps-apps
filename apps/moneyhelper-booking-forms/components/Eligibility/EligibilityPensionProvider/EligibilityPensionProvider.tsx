import { TextInput } from '@maps-react/form/components/TextInput/TextInput';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper } from '@maps-react/mhf/components';
import { asString } from '@maps-react/mhf/utils';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { StepName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const EligibilityPensionProvider: BookingStepComponent = ({
  errors,
  entry,
  step,
}) => {
  const { t } = useTranslation();
  const referredFrom = 'referredFrom';
  const transferringTo = 'transferringTo';

  const formContentKey = `components.${StepName.ELIGIBILITY_PENSION_PROVIDER}.form`;

  const referredFromError = getFieldError(referredFrom, errors)
    ? t(`${formContentKey}.referred-from.error`)
    : undefined;

  const transferringToError = getFieldError(transferringTo, errors)
    ? t(`${formContentKey}.transferring-to.error`)
    : undefined;

  return (
    <FormWrapper
      className="lg:max-w-3xl"
      step={step}
      nextStep={StepName.ACCESS_SUPPORT}
    >
      <TextInput
        id={referredFrom}
        name={referredFrom}
        error={referredFromError}
        label={t(`${formContentKey}.referred-from.label`)}
        hasErrorWrapper
        defaultValue={asString(entry?.data?.referredFrom)}
        className="mb-8"
      />
      <TextInput
        id={transferringTo}
        name={transferringTo}
        error={transferringToError}
        label={t(`${formContentKey}.transferring-to.label`)}
        hasErrorWrapper
        defaultValue={asString(entry?.data?.transferringTo)}
      />
    </FormWrapper>
  );
};
