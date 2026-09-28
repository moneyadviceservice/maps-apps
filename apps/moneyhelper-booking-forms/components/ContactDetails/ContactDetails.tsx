import { ExpandableSection } from '@maps-react/common/components/ExpandableSection/ExpandableSection';
import { DateInput } from '@maps-react/form/components/DateInput/DateInput';
import { TextInput } from '@maps-react/form/components/TextInput/TextInput';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper, SectionsRenderer } from '@maps-react/mhf/components';
import { asString } from '@maps-react/mhf/utils';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import {
  FORM_FIELD_CONTENT_KEY,
  FormFieldName,
  StepName,
} from '../../lib/constants';
import { BookingStepComponent } from '../../lib/types';

export const ContactDetails: BookingStepComponent = ({
  step,
  entry,
  errors,
}) => {
  const { t, tList } = useTranslation();
  const contentKey = `components.${step}`;
  const formComponentKey = `${contentKey}.form`;
  const sections = tList(`${contentKey}.sections`);

  const dateOfBirthDefaultValues = [
    entry?.data?.day ?? '',
    entry?.data?.month ?? '',
    entry?.data?.year ?? '',
  ].join('-');

  const renderExpandableSection = (fieldKey: string) => (
    <ExpandableSection
      title={t(`${formComponentKey}.${fieldKey}.expandable-section.title`)}
    >
      {t(`${formComponentKey}.${fieldKey}.expandable-section.content`)}
    </ExpandableSection>
  );

  return (
    <>
      <SectionsRenderer sections={sections} testIdPrefix={step} />
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
            id={FormFieldName.FIRST_NAME}
            name={FormFieldName.FIRST_NAME}
            label={t(
              `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.firstName}.label`,
            )}
            type="text"
            data-testid={`input-${FormFieldName.FIRST_NAME}`}
            error={
              getFieldError(FormFieldName.FIRST_NAME, errors)
                ? t(
                    `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.firstName}.error`,
                  )
                : undefined
            }
            defaultValue={asString(entry?.data?.firstName)}
            hasGlassBoxClass
            hasErrorWrapper
          />
          <TextInput
            id={FormFieldName.LAST_NAME}
            name={FormFieldName.LAST_NAME}
            label={t(
              `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.lastName}.label`,
            )}
            type="text"
            data-testid={`input-${FormFieldName.LAST_NAME}`}
            error={
              getFieldError(FormFieldName.LAST_NAME, errors)
                ? t(
                    `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.lastName}.error`,
                  )
                : undefined
            }
            defaultValue={asString(entry?.data?.lastName)}
            hasGlassBoxClass
            hasErrorWrapper
          />
          <TextInput
            id={FormFieldName.EMAIL_ADDRESS}
            name={FormFieldName.EMAIL_ADDRESS}
            label={t(
              `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.emailAddress}.label`,
            )}
            type="text"
            data-testid={`input-${FormFieldName.EMAIL_ADDRESS}`}
            error={
              getFieldError(FormFieldName.EMAIL_ADDRESS, errors)
                ? t(
                    `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.emailAddress}.error`,
                  )
                : undefined
            }
            defaultValue={asString(entry?.data?.emailAddress)}
            hasGlassBoxClass
            hasErrorWrapper
          >
            {renderExpandableSection(FORM_FIELD_CONTENT_KEY.emailAddress)}
          </TextInput>
          <TextInput
            id={FormFieldName.PHONE_NUMBER}
            name={FormFieldName.PHONE_NUMBER}
            label={t(
              `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.phoneNumber}.label`,
            )}
            type="text"
            data-testid={`input-${FormFieldName.PHONE_NUMBER}`}
            error={
              getFieldError(FormFieldName.PHONE_NUMBER, errors)
                ? t(
                    `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.phoneNumber}.error`,
                  )
                : undefined
            }
            defaultValue={asString(entry?.data?.phoneNumber)}
            hasGlassBoxClass
            hasErrorWrapper
          >
            {renderExpandableSection(FORM_FIELD_CONTENT_KEY.phoneNumber)}
          </TextInput>
          <DateInput
            legend={t(
              `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.dateOfBirth}.label`,
            )}
            hintText={t(
              `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.dateOfBirth}.hint`,
            )}
            error={
              getFieldError(FormFieldName.DATE_OF_BIRTH, errors)
                ? t(
                    `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.dateOfBirth}.error`,
                  )
                : undefined
            }
            fieldErrors={{
              day: Boolean(getFieldError(FormFieldName.DATE_OF_BIRTH, errors)),
              month: Boolean(
                getFieldError(FormFieldName.DATE_OF_BIRTH, errors),
              ),
              year: Boolean(getFieldError(FormFieldName.DATE_OF_BIRTH, errors)),
            }}
            defaultValues={dateOfBirthDefaultValues}
            showDayField
            hasErrorWrapper
          >
            <div className="mt-2">
              {renderExpandableSection(FORM_FIELD_CONTENT_KEY.dateOfBirth)}
            </div>
          </DateInput>
          <TextInput
            id={FormFieldName.MEMORABLE_WORD}
            name={FormFieldName.MEMORABLE_WORD}
            label={t(
              `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.memorableWord}.label`,
            )}
            hint={t(
              `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.memorableWord}.hint`,
            )}
            type="text"
            data-testid={`input-${FormFieldName.MEMORABLE_WORD}`}
            error={
              getFieldError(FormFieldName.MEMORABLE_WORD, errors)
                ? t(
                    `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.memorableWord}.error`,
                  )
                : undefined
            }
            defaultValue={asString(entry?.data?.memorableWord)}
            hasGlassBoxClass
            hasErrorWrapper
          ></TextInput>
        </div>
      </FormWrapper>
    </>
  );
};
