import { Errors } from '@maps-react/common/components/Errors';
import { TextArea } from '@maps-react/form/components/TextArea';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { FlowName, FLOWS_WITH_BOOKING_REFERENCE } from '../../lib/constants';
import { StepComponent } from '../../lib/types';
import { getFieldError, hasFieldError } from '../../lib/utils';
import { FormWrapper } from '../FormWrapper';

export const Enquiry: StepComponent = ({ errors, entry, flow, step }) => {
  const { t } = useTranslation();
  const showBookingReference = flow
    ? FLOWS_WITH_BOOKING_REFERENCE.includes(flow as FlowName)
    : false;
  return (
    <FormWrapper step={step} className="pt-4">
      <Errors errors={hasFieldError(errors, 'text-area')}>
        <Markdown
          content={t(`components.enquiry.form.text-area.${flow}.label`)}
        />
        <TextArea
          id="text-area"
          name="text-area"
          error={
            getFieldError(errors, 'text-area')
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
          <Errors errors={hasFieldError(errors, 'booking-reference')}>
            <TextInput
              id="booking-reference"
              name="booking-reference"
              label={t('components.enquiry.form.booking-reference.label')}
              hint={t('components.enquiry.form.booking-reference.hint')}
              type="text"
              data-testid="input-booking-reference"
              error={
                getFieldError(errors, 'booking-reference')
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
