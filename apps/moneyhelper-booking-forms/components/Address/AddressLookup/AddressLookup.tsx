import { Button } from '@maps-react/common/components/Button/Button';
import { TextInput } from '@maps-react/form/components/TextInput/TextInput';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper, SectionsRenderer } from '@maps-react/mhf/components';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import {
  FORM_FIELD_CONTENT_KEY,
  FormFieldName,
  StepName,
} from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const AddressLookup: BookingStepComponent = ({
  step,
  entry,
  errors,
}) => {
  const { t, tList, locale } = useTranslation();
  const contentKey = `components.${step}`;
  const formContentKey = `${contentKey}.form`;
  const sections = tList(`${contentKey}.sections`);

  return (
    <>
      <FormWrapper step={step} className="md:max-w-2xl">
        <div className="flex flex-col gap-8">
          <SectionsRenderer sections={sections} testIdPrefix={step} />
          <TextInput
            id={FormFieldName.LOOKUP_POSTCODE}
            name={FormFieldName.LOOKUP_POSTCODE}
            label={t(
              `${formContentKey}.${FORM_FIELD_CONTENT_KEY.lookupPostcode}.label`,
            )}
            type="text"
            data-testid={`input-${FormFieldName.LOOKUP_POSTCODE}`}
            error={
              getFieldError(FormFieldName.LOOKUP_POSTCODE, errors)
                ? t(
                    `${formContentKey}.${FORM_FIELD_CONTENT_KEY.lookupPostcode}.error`,
                  )
                : undefined
            }
            hasGlassBoxClass
            hasErrorWrapper
          />
          <TextInput
            id={FormFieldName.LOOKUP_ADDRESS_LINE_1}
            name={FormFieldName.LOOKUP_ADDRESS_LINE_1}
            label={t(
              `${formContentKey}.${FORM_FIELD_CONTENT_KEY.lookupAddressLine1}.label`,
            )}
            type="text"
            data-testid={`input-${FormFieldName.LOOKUP_ADDRESS_LINE_1}`}
            error={
              getFieldError(FormFieldName.LOOKUP_ADDRESS_LINE_1, errors)
                ? t(
                    `${formContentKey}.${FORM_FIELD_CONTENT_KEY.lookupAddressLine1}.error`,
                  )
                : undefined
            }
            hasGlassBoxClass
            hasErrorWrapper
          />
        </div>
      </FormWrapper>
      {/* Mannually build the form for a different styled link to the next step */}
      <form
        action="/api/form-handler"
        method="POST"
        noValidate
        aria-label="address-manual-entry-form"
      >
        {/* Carries the URL-derived locale through JavaScript-free form submissions. see FormWrapper */}
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="currentStep" value={step} />
        <input type="hidden" name="nextStep" value={StepName.ADDRESS_DETAILS} />

        {/* Hidden inputs to bypass validation for the lookup fields as this is the form with the link to the next step */}
        <input
          type="hidden"
          name={FormFieldName.LOOKUP_POSTCODE}
          value="manual"
        />
        <input
          type="hidden"
          name={FormFieldName.LOOKUP_ADDRESS_LINE_1}
          value="manual"
        />
        <Button
          type="submit"
          data-testid="address-manual-entry-form-button"
          variant="link"
        >
          {t(`${contentKey}.link`)}
        </Button>
      </form>
    </>
  );
};
