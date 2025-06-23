import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { H1 } from '@maps-react/common/components/Heading';
import { TextArea } from '@maps-react/form/components/TextArea';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';

import { FlowName, FLOWS_WITH_BOOKING_REFERENCE } from '../../lib/constants';
import { StepComponent } from '../../lib/types';
import { getFieldError, hasFieldError } from '../../lib/utils';

export const Enquiry: StepComponent = ({ errors, entry, flow }) => {
  const { t, locale } = useTranslation();
  const showBookingReference = flow
    ? FLOWS_WITH_BOOKING_REFERENCE.includes(flow as FlowName)
    : false;
  return (
    <>
      <H1 className="mb-4 text-blue-800" data-testid="enquiry-title">
        {t('components.enquiry.title')}
      </H1>

      <form action="/api/form-handler" method="POST" noValidate>
        <input type="hidden" name="lang" value={locale} />
        <Errors errors={hasFieldError(errors, 'text-area')}>
          <TextArea
            id="text-area"
            name="text-area"
            error={
              getFieldError(errors, 'text-area')
                ? t('components.enquiry.form.text-area.error')
                : undefined
            }
            label={t(`components.enquiry.form.text-area.${flow}.label`)}
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
        <Button type="submit" className="mt-9" data-testid="continue-button">
          {t('common.continue')}
        </Button>
      </form>
    </>
  );
};
