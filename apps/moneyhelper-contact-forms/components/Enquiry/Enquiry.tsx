import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { H1 } from '@maps-react/common/components/Heading';
import { TextArea } from '@maps-react/form/components/TextArea';
import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';
import { getFieldError, hasFieldError } from '../../lib/utils';

export const Enquiry: StepComponent = ({ errors, entry, flow }) => {
  const { t, locale } = useTranslation();

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
          />
        </Errors>
        <Button type="submit" className="mt-9" data-testid="continue-button">
          {t('common.continue')}
        </Button>
      </form>
    </>
  );
};
