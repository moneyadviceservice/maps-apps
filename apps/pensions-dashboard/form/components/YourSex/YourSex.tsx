import { useEffect, useState } from 'react';

import { twMerge } from 'tailwind-merge';

import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';
import { TextInput } from '@maps-react/form/components/TextInput/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';
import { FormWrapper, SubTitleRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';
import { asString } from '@maps-react/mhf/utils/entryValueHelpers';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import {
  FORM_BASE_PATH,
  FORM_FIELD_CONTENT_KEY,
  FormFieldName,
  StepName,
} from '../../constants';

export const YourSex: StepComponent = ({ errors, step, entry }) => {
  const { t, tList } = useTranslation();
  const contentKey = `${FORM_BASE_PATH}/components.${step}`;
  const formContentKey = `${contentKey}.form.${FORM_FIELD_CONTENT_KEY.yourSex}`;
  const yourSexOptions = tList(`${formContentKey}.options`);
  const formComponentKey = `${contentKey}.form`;
  const [showOther, setShowOther] = useState(false);
  const [otherValue, setOtherValue] = useState(
    asString(entry?.data?.[FormFieldName.OTHER_SEX]) || '',
  );
  const otherSexTermError = getFieldError(FormFieldName.OTHER_SEX, errors)
    ? t(`${formComponentKey}.${FORM_FIELD_CONTENT_KEY.otherSex}.error`)
    : undefined;

  // Handle the change event for the radio button
  const handleRadioButtonChange = (value: string) => {
    setShowOther(value === 'other');
    if (value !== 'other') {
      setOtherValue('');
    }
  };

  // Update visibility of the "Other" text input based on the selected radio button option
  useEffect(() => {
    setShowOther(asString(entry?.data?.[FormFieldName.YOUR_SEX]) === 'other');
  }, [entry?.data?.[FormFieldName.YOUR_SEX]]);

  return (
    <>
      <SubTitleRenderer
        content={t(`${contentKey}.sub-title`)}
        testId={`${step}-sub-title`}
      />
      <FormWrapper step={step} nextStep={StepName.HEALTH_CONDITIONS}>
        <div className="flex flex-col gap-4">
          <QuestionRadioButton
            onChange={(e) => handleRadioButtonChange(e.target.value)}
            hideLabel={true}
            options={yourSexOptions}
            name={FormFieldName.YOUR_SEX}
            error={
              getFieldError(FormFieldName.YOUR_SEX, errors)
                ? t(`${formContentKey}.error`)
                : undefined
            }
            hasErrorWrapper={true}
            defaultChecked={asString(entry?.data?.[FormFieldName.YOUR_SEX])}
          >
            {t(`${formContentKey}.label`)}
          </QuestionRadioButton>

          <div
            className={twMerge(
              'ml-5 block',
              !otherSexTermError && 'border-gray-300 pl-8 border-l-4 ',
              !showOther && 'hidden',
            )}
          >
            <TextInput
              containerClassName={twMerge(
                '[&_input]:max-w-[450px] pb-4',
                otherSexTermError && 'pl-3',
              )}
              label={t(
                `${formComponentKey}.${FORM_FIELD_CONTENT_KEY.otherSex}.label`,
              )}
              id={FormFieldName.OTHER_SEX}
              name={FormFieldName.OTHER_SEX}
              type="text"
              data-testid={`input-${FORM_FIELD_CONTENT_KEY.otherSex}`}
              error={otherSexTermError}
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
              hasGlassBoxClass
              hasErrorWrapper
              maxLength={50}
            />
          </div>
        </div>
      </FormWrapper>
    </>
  );
};
