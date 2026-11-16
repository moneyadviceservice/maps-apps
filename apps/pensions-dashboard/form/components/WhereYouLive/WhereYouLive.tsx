import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';
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

export const WhereYouLive: StepComponent = ({ errors, step, entry }) => {
  const { t, tList } = useTranslation();
  const contentKey = `${FORM_BASE_PATH}/components.${step}`;
  const formContentKey = `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.whereYouLive}`;

  return (
    <FormWrapper
      step={step}
      nextStep={StepName.YOUR_SEX}
      className="pt-0 md:pt-0"
    >
      <div className="flex flex-col gap-8">
        <QuestionRadioButton
          hideLabel={true}
          options={tList(`${formContentKey}.options`)}
          name={FormFieldName.WHERE_YOU_LIVE}
          error={
            getFieldError(FormFieldName.WHERE_YOU_LIVE, errors)
              ? t(`${formContentKey}.error`)
              : undefined
          }
          hasErrorWrapper={true}
          defaultChecked={asString(entry?.data?.[FormFieldName.WHERE_YOU_LIVE])}
        >
          {t(`${formContentKey}.label`)}
        </QuestionRadioButton>
      </div>
    </FormWrapper>
  );
};
