import { Errors, ErrorType } from '@maps-react/common/components/Errors';
import { TextArea } from '@maps-react/form/components/TextArea';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';
import { FormWrapper } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';
import { asString, getFieldError } from '@maps-react/mhf/utils';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { StepName } from '../../lib/constants';
import { flowConfig } from '../../routes/flowConfig';

export const Enquiry: StepComponent = ({ errors, entry, flow, step }) => {
  const { t } = useTranslation();
  const config = flow ? flowConfig.get(flow) : undefined;
  const showBookingReference = config?.showBookingReferenceField ?? false;
  const flowHint = t(`components.enquiry.form.text-area.${flow}.hint`);
  const supportHint = t('components.enquiry.form.text-area.support.hint');
  const hintContent = `${flowHint} ${supportHint}`;

  return (
    <FormWrapper
      isLastStep={true}
      className="pt-4"
      nextStep={StepName.LOADING}
      step={step}
      ariaLabel={t('components.enquiry.title')}
    >
      <TextArea
        id="text-area"
        name="text-area"
        label={t(`components.enquiry.form.text-area.label`)}
        hint={<Markdown content={hintContent} disableParagraphs />}
        data-testid="input-text-area"
        characterLimitText={t(
          'components.enquiry.form.text-area.character-limit',
        )}
        error={
          getFieldError('text-area', errors)
            ? t('components.enquiry.form.text-area.error')
            : undefined
        }
        minLength={50}
        maxLength={4000}
        defaultValue={asString(entry?.data?.['text-area'])}
        hasGlassBoxClass={true}
        hideLabel
        hasErrorWrapper
      />
      {showBookingReference && (
        <div className="mt-14">
          <Errors
            errors={
              getFieldError('booking-reference', errors)
                ? [{} as ErrorType]
                : []
            }
          >
            <TextInput
              id="booking-reference"
              name="booking-reference"
              label={t('components.enquiry.form.booking-reference.label')}
              hint={t('components.enquiry.form.booking-reference.hint')}
              type="text"
              data-testid="input-booking-reference"
              error={
                getFieldError('booking-reference', errors)
                  ? t('components.enquiry.form.booking-reference.error')
                  : undefined
              }
              defaultValue={asString(entry?.data?.['booking-reference'])}
            />
          </Errors>
        </div>
      )}
    </FormWrapper>
  );
};
