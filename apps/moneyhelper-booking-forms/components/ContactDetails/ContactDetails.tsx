import { ExpandableSection } from '@maps-react/common/components/ExpandableSection/ExpandableSection';
import { DateInput } from '@maps-react/form/components/DateInput/DateInput';
import { TextInput } from '@maps-react/form/components/TextInput/TextInput';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper } from '@maps-react/mhf/components';
import { asString } from '@maps-react/mhf/utils';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { StepName } from '../../lib/constants';
import { BookingStepComponent } from '../../lib/types';

export const ContactDetails: BookingStepComponent = ({
  step,
  entry,
  errors,
}) => {
  const { t } = useTranslation();
  const componentKey = `components.${StepName.CONTACT_DETAILS}.form`;

  const fieldNames = {
    firstName: 'firstName',
    lastName: 'lastName',
    emailAddress: 'emailAddress',
    phoneNumber: 'phoneNumber',
    dateOfBirth: 'dateOfBirth',
    memorableWord: 'memorableWord',
  } as const;

  const localeFieldKeys: Record<keyof typeof fieldNames, string> = {
    firstName: 'first-name',
    lastName: 'last-name',
    emailAddress: 'email-address',
    phoneNumber: 'phone-number',
    dateOfBirth: 'date-of-birth',
    memorableWord: 'memorable-word',
  };

  const fieldErrors = {
    firstName: getFieldError(fieldNames.firstName, errors),
    lastName: getFieldError(fieldNames.lastName, errors),
    emailAddress: getFieldError(fieldNames.emailAddress, errors),
    phoneNumber: getFieldError(fieldNames.phoneNumber, errors),
    dateOfBirth: getFieldError(fieldNames.dateOfBirth, errors),
    memorableWord: getFieldError(fieldNames.memorableWord, errors),
  };

  const dateOfBirthDefaultValues = [
    entry?.data?.day ?? '',
    entry?.data?.month ?? '',
    entry?.data?.year ?? '',
  ].join('-');

  const renderExpandableSection = (fieldKey: string) => (
    <ExpandableSection
      title={t(`${componentKey}.${fieldKey}.expandable-section.title`)}
    >
      {t(`${componentKey}.${fieldKey}.expandable-section.content`)}
    </ExpandableSection>
  );

  return (
    <FormWrapper
      step={step}
      className="md:max-w-md"
      nextStep={
        entry?.editMode === true
          ? StepName.CONFIRM_DETAILS
          : StepName.COMMUNICATION_PREFERENCES
      }
      saveChanges={entry?.editMode === true}
    >
      <div className="flex flex-col gap-8">
        <TextInput
          id={fieldNames.firstName}
          name={fieldNames.firstName}
          label={t(`${componentKey}.${localeFieldKeys.firstName}.label`)}
          type="text"
          data-testid={`input-${fieldNames.firstName}`}
          error={
            fieldErrors.firstName
              ? t(`${componentKey}.${localeFieldKeys.firstName}.error`)
              : undefined
          }
          defaultValue={asString(entry?.data?.firstName)}
          hasGlassBoxClass
          hasErrorWrapper
        />
        <TextInput
          id={fieldNames.lastName}
          name={fieldNames.lastName}
          label={t(`${componentKey}.${localeFieldKeys.lastName}.label`)}
          type="text"
          data-testid={`input-${fieldNames.lastName}`}
          error={
            fieldErrors.lastName
              ? t(`${componentKey}.${localeFieldKeys.lastName}.error`)
              : undefined
          }
          defaultValue={asString(entry?.data?.lastName)}
          hasGlassBoxClass
          hasErrorWrapper
        />
        <TextInput
          id={fieldNames.emailAddress}
          name={fieldNames.emailAddress}
          label={t(`${componentKey}.${localeFieldKeys.emailAddress}.label`)}
          type="text"
          data-testid={`input-${fieldNames.emailAddress}`}
          error={
            fieldErrors.emailAddress
              ? t(`${componentKey}.${localeFieldKeys.emailAddress}.error`)
              : undefined
          }
          defaultValue={asString(entry?.data?.emailAddress)}
          hasGlassBoxClass
          hasErrorWrapper
        >
          {renderExpandableSection(localeFieldKeys.emailAddress)}
        </TextInput>
        <TextInput
          id={fieldNames.phoneNumber}
          name={fieldNames.phoneNumber}
          label={t(`${componentKey}.${localeFieldKeys.phoneNumber}.label`)}
          type="text"
          data-testid={`input-${fieldNames.phoneNumber}`}
          error={
            fieldErrors.phoneNumber
              ? t(`${componentKey}.${localeFieldKeys.phoneNumber}.error`)
              : undefined
          }
          defaultValue={asString(entry?.data?.phoneNumber)}
          hasGlassBoxClass
          hasErrorWrapper
        >
          {renderExpandableSection(localeFieldKeys.phoneNumber)}
        </TextInput>
        <DateInput
          legend={t(`${componentKey}.${localeFieldKeys.dateOfBirth}.label`)}
          hintText={t(`${componentKey}.${localeFieldKeys.dateOfBirth}.hint`)}
          error={
            fieldErrors.dateOfBirth
              ? t(`${componentKey}.${localeFieldKeys.dateOfBirth}.error`)
              : undefined
          }
          fieldErrors={{
            day: Boolean(fieldErrors.dateOfBirth),
            month: Boolean(fieldErrors.dateOfBirth),
            year: Boolean(fieldErrors.dateOfBirth),
          }}
          defaultValues={dateOfBirthDefaultValues}
          showDayField
          hasErrorWrapper
        >
          <div className="mt-2">
            {renderExpandableSection(localeFieldKeys.dateOfBirth)}
          </div>
        </DateInput>
        <TextInput
          id={fieldNames.memorableWord}
          name={fieldNames.memorableWord}
          label={t(`${componentKey}.${localeFieldKeys.memorableWord}.label`)}
          hint={t(`${componentKey}.${localeFieldKeys.memorableWord}.hint`)}
          type="text"
          data-testid={`input-${fieldNames.memorableWord}`}
          error={
            fieldErrors.memorableWord
              ? t(`${componentKey}.${localeFieldKeys.memorableWord}.error`)
              : undefined
          }
          defaultValue={asString(entry?.data?.memorableWord)}
          hasGlassBoxClass
          hasErrorWrapper
        ></TextInput>
      </div>
    </FormWrapper>
  );
};
