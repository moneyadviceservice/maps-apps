import { TextInput } from '@maps-react/form/components/TextInput/TextInput';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper } from '@maps-react/mhf/components';
import { asString } from '@maps-react/mhf/utils';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { StepName } from '../../lib/constants';
import { BookingStepComponent } from '../../lib/types';

export const AddressDetails: BookingStepComponent = ({
  step,
  entry,
  errors,
}) => {
  const { t } = useTranslation();
  const componentKey = `components.${StepName.ADDRESS_DETAILS}.form`;

  const fieldNames = {
    addressLine1: 'addressLine1',
    addressLine2: 'addressLine2',
    city: 'city',
    county: 'county',
    postcode: 'postcode',
    country: 'country',
  } as const;

  const localeFieldKeys: Record<keyof typeof fieldNames, string> = {
    addressLine1: 'address-line-1',
    addressLine2: 'address-line-2',
    city: 'city',
    county: 'county',
    postcode: 'postcode',
    country: 'country',
  };

  const fieldErrors = {
    addressLine1: getFieldError(fieldNames.addressLine1, errors),
    addressLine2: getFieldError(fieldNames.addressLine2, errors),
    city: getFieldError(fieldNames.city, errors),
    county: getFieldError(fieldNames.county, errors),
    postcode: getFieldError(fieldNames.postcode, errors),
    country: getFieldError(fieldNames.country, errors),
  };

  return (
    <FormWrapper
      step={step}
      className="md:max-w-2xl"
      nextStep={StepName.ADDRESS_CONFIRMATION}
    >
      <div className="flex flex-col gap-8">
        <TextInput
          id={fieldNames.addressLine1}
          name={fieldNames.addressLine1}
          label={t(`${componentKey}.${localeFieldKeys.addressLine1}.label`)}
          type="text"
          data-testid={`input-${fieldNames.addressLine1}`}
          error={
            fieldErrors.addressLine1
              ? t(`${componentKey}.${localeFieldKeys.addressLine1}.error`)
              : undefined
          }
          defaultValue={asString(entry?.data?.addressLine1)}
          hasGlassBoxClass
          hasErrorWrapper
        />
        <TextInput
          id={fieldNames.addressLine2}
          name={fieldNames.addressLine2}
          label={t(`${componentKey}.${localeFieldKeys.addressLine2}.label`)}
          type="text"
          data-testid={`input-${fieldNames.addressLine2}`}
          error={
            fieldErrors.addressLine2
              ? t(`${componentKey}.${localeFieldKeys.addressLine2}.error`)
              : undefined
          }
          defaultValue={asString(entry?.data?.addressLine2)}
          hasGlassBoxClass
          hasErrorWrapper
        />
        <TextInput
          id={fieldNames.city}
          name={fieldNames.city}
          label={t(`${componentKey}.${localeFieldKeys.city}.label`)}
          type="text"
          data-testid={`input-${fieldNames.city}`}
          error={
            fieldErrors.city
              ? t(`${componentKey}.${localeFieldKeys.city}.error`)
              : undefined
          }
          defaultValue={asString(entry?.data?.city)}
          hasGlassBoxClass
          hasErrorWrapper
        />
        <TextInput
          id={fieldNames.county}
          name={fieldNames.county}
          label={t(`${componentKey}.${localeFieldKeys.county}.label`)}
          type="text"
          data-testid={`input-${fieldNames.county}`}
          error={
            fieldErrors.county
              ? t(`${componentKey}.${localeFieldKeys.county}.error`)
              : undefined
          }
          defaultValue={asString(entry?.data?.county)}
          hasGlassBoxClass
          hasErrorWrapper
        />
        <TextInput
          id={fieldNames.postcode}
          name={fieldNames.postcode}
          label={t(`${componentKey}.${localeFieldKeys.postcode}.label`)}
          type="text"
          data-testid={`input-${fieldNames.postcode}`}
          error={
            fieldErrors.postcode
              ? t(`${componentKey}.${localeFieldKeys.postcode}.error`)
              : undefined
          }
          defaultValue={asString(entry?.data?.postcode)}
          hasGlassBoxClass
          hasErrorWrapper
        />
        <TextInput
          id={fieldNames.country}
          name={fieldNames.country}
          label={t(`${componentKey}.${localeFieldKeys.country}.label`)}
          type="text"
          data-testid={`input-${fieldNames.country}`}
          error={
            fieldErrors.country
              ? t(`${componentKey}.${localeFieldKeys.country}.error`)
              : undefined
          }
          defaultValue={asString(entry?.data?.country)}
          hasGlassBoxClass
          hasErrorWrapper
        />
      </div>
    </FormWrapper>
  );
};
