import { Errors, ErrorType } from '@maps-react/common/components/Errors';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';
import { FormWrapper } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';
import { getFieldError, safeT } from '@maps-react/mhf/utils';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { DOB } from '../../lib/constants';

export const DateOfBirth: StepComponent = ({ errors, entry, flow }) => {
  const { t } = useTranslation();
  // Define the content keys for generic and specific expandable section messages
  const genericKey = 'components.date-of-birth.expandable-section';
  const specificKey = `components.date-of-birth.expandable-section.${flow}`;

  // Fallback to generic content if specific content is not available
  const expandableContent =
    safeT(t, `${specificKey}.content`) ?? t(`${genericKey}.content`);

  const error = getFieldError('dates', errors)
    ? t('components.date-of-birth.form.generic.error')
    : undefined;

  return (
    <FormWrapper className="pt-4 md:max-w-xl">
      <Errors errors={error ? [{} as ErrorType] : []}>
        <Paragraph className="text-gray-650" data-testid="date-of-birth-hint">
          {t('components.date-of-birth.hint')}
        </Paragraph>
        <TextInput type="hidden" error={error} />
      </Errors>
      <div className="flex gap-5 mb-2">
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
            hasGlassBoxClass={true}
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
            hasGlassBoxClass={true}
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
            hasGlassBoxClass={true}
          />
        </div>
      </div>
      <ExpandableSection
        title={t('components.date-of-birth.expandable-section.title')}
      >
        <Markdown
          content={expandableContent}
          data-testid="date-of-birth-expandable-content"
        />
      </ExpandableSection>
    </FormWrapper>
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
