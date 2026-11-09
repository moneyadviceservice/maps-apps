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

export const AddressDetails: BookingStepComponent = ({
  step,
  entry,
  errors,
}) => {
  const { t } = useTranslation();
  const formContentKey = `components.${step}.form`;

  return (
    <FormWrapper
      step={step}
      className="md:max-w-2xl"
      nextStep={StepName.ADDRESS_CONFIRMATION}
    >
      <div className="flex flex-col gap-8">
        <TextInput
          id={FormFieldName.ADDRESS_LINE_1}
          name={FormFieldName.ADDRESS_LINE_1}
          label={t(
            `${formContentKey}.${FORM_FIELD_CONTENT_KEY.addressLine1}.label`,
          )}
          type="text"
          data-testid={`input-${FormFieldName.ADDRESS_LINE_1}`}
          error={
            getFieldError(FormFieldName.ADDRESS_LINE_1, errors)
              ? t(
                  `${formContentKey}.${FORM_FIELD_CONTENT_KEY.addressLine1}.error`,
                )
              : undefined
          }
          defaultValue={asString(entry?.data?.[FormFieldName.ADDRESS_LINE_1])}
          hasGlassBoxClass
          hasErrorWrapper
        />
        <TextInput
          id={FormFieldName.ADDRESS_LINE_2}
          name={FormFieldName.ADDRESS_LINE_2}
          label={t(
            `${formContentKey}.${FORM_FIELD_CONTENT_KEY.addressLine2}.label`,
          )}
          type="text"
          data-testid={`input-${FormFieldName.ADDRESS_LINE_2}`}
          error={
            getFieldError(FormFieldName.ADDRESS_LINE_2, errors)
              ? t(
                  `${formContentKey}.${FORM_FIELD_CONTENT_KEY.addressLine2}.error`,
                )
              : undefined
          }
          defaultValue={asString(entry?.data?.[FormFieldName.ADDRESS_LINE_2])}
          hasGlassBoxClass
          hasErrorWrapper
        />
        <TextInput
          id={FormFieldName.CITY}
          name={FormFieldName.CITY}
          label={t(`${formContentKey}.${FORM_FIELD_CONTENT_KEY.city}.label`)}
          type="text"
          data-testid={`input-${FormFieldName.CITY}`}
          error={
            getFieldError(FormFieldName.CITY, errors)
              ? t(`${formContentKey}.${FORM_FIELD_CONTENT_KEY.city}.error`)
              : undefined
          }
          defaultValue={asString(entry?.data?.[FormFieldName.CITY])}
          hasGlassBoxClass
          hasErrorWrapper
        />
        <TextInput
          id={FormFieldName.COUNTY}
          name={FormFieldName.COUNTY}
          label={t(`${formContentKey}.${FORM_FIELD_CONTENT_KEY.county}.label`)}
          type="text"
          data-testid={`input-${FormFieldName.COUNTY}`}
          error={
            getFieldError(FormFieldName.COUNTY, errors)
              ? t(`${formContentKey}.${FORM_FIELD_CONTENT_KEY.county}.error`)
              : undefined
          }
          defaultValue={asString(entry?.data?.[FormFieldName.COUNTY])}
          hasGlassBoxClass
          hasErrorWrapper
        />
        <TextInput
          id={FormFieldName.POSTCODE}
          name={FormFieldName.POSTCODE}
          label={t(
            `${formContentKey}.${FORM_FIELD_CONTENT_KEY.postcode}.label`,
          )}
          type="text"
          data-testid={`input-${FormFieldName.POSTCODE}`}
          error={
            getFieldError(FormFieldName.POSTCODE, errors)
              ? t(`${formContentKey}.${FORM_FIELD_CONTENT_KEY.postcode}.error`)
              : undefined
          }
          defaultValue={asString(entry?.data?.[FormFieldName.POSTCODE])}
          hasGlassBoxClass
          hasErrorWrapper
        />
        <TextInput
          id={FormFieldName.COUNTRY}
          name={FormFieldName.COUNTRY}
          label={t(`${formContentKey}.${FORM_FIELD_CONTENT_KEY.country}.label`)}
          type="text"
          data-testid={`input-${FormFieldName.COUNTRY}`}
          error={
            getFieldError(FormFieldName.COUNTRY, errors)
              ? t(`${formContentKey}.${FORM_FIELD_CONTENT_KEY.country}.error`)
              : undefined
          }
          defaultValue={asString(entry?.data?.[FormFieldName.COUNTRY])}
          hasGlassBoxClass
          hasErrorWrapper
        />
      </div>
    </FormWrapper>
  );
};
