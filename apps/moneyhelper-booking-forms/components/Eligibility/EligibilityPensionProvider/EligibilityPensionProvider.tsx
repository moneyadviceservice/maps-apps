import { TextInput } from '@maps-react/form/components/TextInput/TextInput';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper } from '@maps-react/mhf/components';
import { asString } from '@maps-react/mhf/utils';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import {
  FORM_FIELD_CONTENT_KEY,
  FormFieldName,
  StepName,
} from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const EligibilityPensionProvider: BookingStepComponent = ({
  errors,
  entry,
  step,
}) => {
  const { t } = useTranslation();

  const formContentKey = `components.${step}.form`;

  return (
    <FormWrapper
      className="lg:max-w-3xl"
      step={step}
      nextStep={StepName.ACCESS_SUPPORT}
    >
      <TextInput
        id={FormFieldName.ELIGIBILITY_REFERRED_FROM}
        name={FormFieldName.ELIGIBILITY_REFERRED_FROM}
        error={
          getFieldError(FormFieldName.ELIGIBILITY_REFERRED_FROM, errors)
            ? t(
                `${formContentKey}.${FORM_FIELD_CONTENT_KEY.eligibilityReferredFrom}.error`,
              )
            : undefined
        }
        label={t(
          `${formContentKey}.${FORM_FIELD_CONTENT_KEY.eligibilityReferredFrom}.label`,
        )}
        hasErrorWrapper
        defaultValue={asString(
          entry?.data?.[FormFieldName.ELIGIBILITY_REFERRED_FROM],
        )}
        className="mb-8"
      />
      <TextInput
        id={FormFieldName.ELIGIBILITY_TRANSFERRING_TO}
        name={FormFieldName.ELIGIBILITY_TRANSFERRING_TO}
        error={
          getFieldError(FormFieldName.ELIGIBILITY_TRANSFERRING_TO, errors)
            ? t(
                `${formContentKey}.${FORM_FIELD_CONTENT_KEY.eligibilityTransferringTo}.error`,
              )
            : undefined
        }
        label={t(
          `${formContentKey}.${FORM_FIELD_CONTENT_KEY.eligibilityTransferringTo}.label`,
        )}
        hasErrorWrapper
        defaultValue={asString(
          entry?.data?.[FormFieldName.ELIGIBILITY_TRANSFERRING_TO],
        )}
      />
    </FormWrapper>
  );
};
