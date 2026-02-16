import { Errors, ErrorType } from '@maps-react/common/components/Errors';
import { TextArea } from '@maps-react/form/components/TextArea';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';
import { FormWrapper } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';
import { getFieldError } from '@maps-react/mhf/utils';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { routeFlow } from '../../routes/routeFlow';

export const Enquiry: StepComponent = ({ errors, entry, flow, step }) => {
  const { t } = useTranslation();
  const flowConfig = flow ? routeFlow.get(flow) : undefined;
  const showBookingReference = flowConfig?.showBookingReferenceField ?? false;

  return (
    <FormWrapper step={step} isLastStep={true} className="pt-4">
      <Errors
        errors={getFieldError('text-area', errors) ? [{} as ErrorType] : []}
      >
        <TextArea
          id="text-area"
          name="text-area"
          label={
            <Markdown
              content={t(`components.enquiry.form.text-area.${flow}.label`)}
            />
          }
          error={
            getFieldError('text-area', errors)
              ? t('components.enquiry.form.text-area.error')
              : undefined
          }
          minLength={50}
          maxLength={4000}
          hasCharacterCounter
          defaultValue={entry?.data?.['text-area'] ?? ''}
          hasGlassBoxClass={true}
        />
      </Errors>
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
              defaultValue={entry?.data?.['booking-reference'] ?? ''}
            />
          </Errors>
        </div>
      )}
    </FormWrapper>
  );
};
