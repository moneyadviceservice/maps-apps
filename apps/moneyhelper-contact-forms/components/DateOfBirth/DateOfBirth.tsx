import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';

import { DOB } from '../../lib/constants';
import { StepComponent } from '../../lib/types';
import { getFieldError, hasFieldError } from '../../lib/utils';

export const DateOfBirth: StepComponent = ({ errors, entry }) => {
  const { t, locale } = useTranslation();

  return (
    <>
      <H1 className="mb-4 text-blue-800" data-testid="date-of-birth-title">
        {t('components.date-of-birth.title')}
      </H1>
      <form action="/api/form-handler" method="POST" noValidate>
        <input type="hidden" name="lang" value={locale} />
        <Errors errors={hasFieldError(errors, 'dates')}>
          <Paragraph className="text-gray-400">
            {t('components.date-of-birth.intro')}
          </Paragraph>
          <TextInput
            type="hidden"
            error={
              getFieldError(errors, 'dates')
                ? t('components.date-of-birth.form.generic.error')
                : undefined
            }
          />
        </Errors>
        <div className="flex gap-5 mb-9">
          <div className=" max-w-16">
            <TextInput
              id="day"
              name="day"
              type="number"
              data-testid="input-day"
              label={t('components.date-of-birth.form.day.label')}
              defaultValue={entry?.data?.day ?? ''}
              min={DOB.day.min}
              max={DOB.day.max}
              onKeyDown={dobInputHandlers.blockNegativeAndE}
              onInput={dobInputHandlers.sanitizeInput}
            />
          </div>
          <div className="max-w-16">
            <TextInput
              id="month"
              name="month"
              type="number"
              data-testid="input-month"
              label={t('components.date-of-birth.form.month.label')}
              defaultValue={entry?.data?.month ?? ''}
              min={DOB.month.min}
              max={DOB.month.max}
              onKeyDown={dobInputHandlers.blockNegativeAndE}
              onInput={dobInputHandlers.sanitizeInput}
            />
          </div>
          <div className="max-w-24">
            <TextInput
              id="year"
              name="year"
              type="number"
              data-testid="input-year"
              label={t('components.date-of-birth.form.year.label')}
              defaultValue={entry?.data?.year ?? ''}
              min={DOB.year.min}
              max={DOB.year.max}
              onKeyDown={dobInputHandlers.blockNegativeAndE}
              onInput={dobInputHandlers.sanitizeInput}
            />
          </div>
        </div>
        <ExpandableSection
          title={t('components.date-of-birth.expandable-section.title')}
        >
          <Paragraph>
            {t('components.date-of-birth.expandable-section.content')}
          </Paragraph>
        </ExpandableSection>
        <Button type="submit" className="mt-9" data-testid="continue-button">
          {t('common.continue')}
        </Button>
      </form>
    </>
  );
};

/**
 * Handlers for the date of birth input fields.
 * - `blockNegativeAndE`: Prevents negative numbers and scientific notation (e.g., 'e') in the input.
 * - `sanitizeInput`: Sanitizes the input to allow only digits.
 * Progressive enhancement is used to ensure for JS-enabled browsers, the input fields only accept valid numeric values.
 */
export const dobInputHandlers = {
  blockNegativeAndE(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  },
  sanitizeInput(event: React.FormEvent<HTMLInputElement>) {
    const element = event.currentTarget;
    element.value = element.value.replace(/[^\d]/g, '');
  },
};
