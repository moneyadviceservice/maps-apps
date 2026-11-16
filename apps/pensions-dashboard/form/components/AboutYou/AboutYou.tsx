import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';
import { TextInput } from '@maps-react/form/components/TextInput/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';
import { FormWrapper } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';
import { asString } from '@maps-react/mhf/utils/entryValueHelpers';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import {
  FORM_BASE_PATH,
  FORM_FIELD_CONTENT_KEY,
  FormFieldName,
  StepName,
} from '../../constants';

export const AboutYou: StepComponent = ({ step, entry, errors }) => {
  const { t, tList } = useTranslation();
  const contentKey = `${FORM_BASE_PATH}/components.${step}`;
  const formComponentKey = `${contentKey}.form`;

  return (
    <FormWrapper
      step={step}
      nextStep={StepName.WHERE_YOU_LIVE}
      className="pt-0 md:pt-0"
    >
      <div className="flex flex-col gap-8">
        <TextInput
          id={FormFieldName.FIRST_NAME}
          name={FormFieldName.FIRST_NAME}
          label={t(
            `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.firstName}.label`,
          )}
          type="text"
          data-testid={`input-${FORM_FIELD_CONTENT_KEY.firstName}`}
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
          maxLength={50}
          containerClassName="[&_input]:max-w-[450px]"
        />

        <TextInput
          id={FormFieldName.LAST_NAME}
          name={FormFieldName.LAST_NAME}
          label={t(
            `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.lastName}.label`,
          )}
          type="text"
          data-testid={`input-${FORM_FIELD_CONTENT_KEY.lastName}`}
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
          maxLength={50}
          containerClassName="[&_input]:max-w-[450px]"
        />

        <TextInput
          id={FormFieldName.EMAIL_ADDRESS}
          name={FormFieldName.EMAIL_ADDRESS}
          label={t(
            `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.emailAddress}.label`,
          )}
          type="email"
          data-testid={`input-${FORM_FIELD_CONTENT_KEY.emailAddress}`}
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
          maxLength={150}
          containerClassName="[&_input]:max-w-[450px]"
        />

        <QuestionRadioButton
          options={tList(
            `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.ageRange}.options`,
          )}
          name={FormFieldName.AGE_RANGE}
          error={
            getFieldError(FormFieldName.AGE_RANGE, errors)
              ? t(
                  `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.ageRange}.error`,
                )
              : undefined
          }
          hasErrorWrapper={true}
          defaultChecked={asString(entry?.data?.[FormFieldName.AGE_RANGE])}
        >
          {t(`${formComponentKey}.${FORM_FIELD_CONTENT_KEY.ageRange}.label`)}
        </QuestionRadioButton>
      </div>
    </FormWrapper>
  );
};
